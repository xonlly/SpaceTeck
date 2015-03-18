// Serveur MultiPlayer
'use strict';

var express 	= require('express');
var app 		= express();
var server 		= require('http').Server(app);

var map 		= require('./scripts_server/Map.js');
var Mapping		= require('./scripts_server/ImageMapping.js');
var Players		= require('./scripts_server/Players.js');
var IA			= require('./scripts_server/IA.js');

var config		= {
	xp : { diePlayerPoints : 50 },

};
var playerSpawn = 0
	, players 	= [];

server.listen(8183);

app.use(function (req, res, next) {
	/* Custom des headers pour des navigateurs qui pete les couilles */
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Credentials", "false");
	res.header("X-Engine", "Devteck-Engine");

	next();
});

// Serveur static pour l'interface.
app.use(express.static(__dirname));

// Ouverture du serveur socket.io
var io = require('socket.io')(server);
io.use(function(socket, next){
	socket.request.headers['X-Engine'] = 'Socket-Devteck-Engine';
	socket.request.headers['Access-Control-Allow-Credentials'] = 'false';
	next();
});

var world = {};

if (process.argv[2] == 'gen') {
	if (process.argv[3] == 'map') {
		map.saveMap('default', map.genMap());
	}

	if (process.argv[3] == 'mapping') {
		Mapping.prepare();
		Mapping.setImages({
			planeteBlue : '110000.png',
			planeteVenus : 'Mod_4_Image_3_venus_NASA.png',
			planeteEarth : 'Mod_4_Image_4_earth_NASA.png',
			planeteMars : 'Mod_4_Image_5_mars_NASA.png',
			planeteJupiter : 'Mod_4_Image_6_jupiter_NASA.png',
			planeteSaturn : 'Mod_4_Image_7_saturn_NASA.png',
			planeteNeptune : 'Mod_4_Image_9_neptune_NASA.png',

			asteroide : 'asteroide.png',
			asteroideBlue : 'asteroide1.png',
			asteroidesBare : 'asteroides.png',
			asteroidesGroupe : 'asteroides1.png',
			asteroideSeul : 'asteroides2.png',

			WorldImage : 'stock_planet_techno_fractal_by_svetlanaivanova-d5bg82w.png',
			LuneImage : 'Lune_ico.png',
		});
		Mapping.genImagesContact();
	}
	console.log('Finish GEN');
	process.exit(1);
}

world = map.getMap();

// Nouveau thread:
setTimeout(function () {

	io.on('connection', function (socket) {
		console.log('Nouveau '+socket.id+' '+socket.request.connection.remoteAddress);

		Players.config.players[socket.id] = { socket: socket, pts: 0, cheat: 10 };

		// Modification de la zone de spawn pour chaque nouveau spawn.
		playerSpawn = playerSpawn > 1500 ? 0 : playerSpawn + 150;

		console.log('hello '+socket.id +" "+ playerSpawn+"spawn");
		io.emit('tchat', {pseudo: "Serveur", msg: "Hello "+socket.id});
		//io.emit('tchat', {pseudo: "Serveur", msg: "<b>Il y a "+players.length+" en ligne.</b>"});

		socket.emit('hello', { id: socket.id, spawn: playerSpawn });

		// Gestion des balles
		socket.on('bullet', function (data) {
			data = map.moveBullet(data);
			io.emit('bullet', data);
		});

		// Gestion des players.
		socket.on('player', function (data) {

			Players.config.players[socket.id]['poss'] = {
				x : data.donnees.x,
				y : data.donnees.y
			};

			data = map.movePlayer(data);
			//console.log(data);
			io.emit('player', data);
		});

		socket.on('tchat', function (data) {
			console.log('[Tchat]- '+data.pseudo+': '+data.msg);
			io.emit('tchat', data);
		});

		// Gestion des morts
		socket.on('die', function (data) {
			console.log(data);
			io.emit('tchat', {pseudo: "Serveur", msg: data.player.pseudo + " kill " + data.killed.pseudo });
			io.emit('die', data);
		});

		// Gestion des deconnexion
		socket.on('disconnect', function () {
			console.log('Disconnect '+socket.id);
			io.emit('tchat', {pseudo: "Serveur", msg: "Disconnect "+socket.id});
			delete Players.config.players[socket.id];
			io.emit('bay', { pid: socket.id });
		});
	});


}, 0);

setInterval(function () { // Envoi de la map pour chaque player
	var players = Players.config.players;
	for (var key in players) {
		if (players[key].bot) { continue; }
		if (typeof players[key].poss != 'undefined') {
			console.log(players[key].poss);
			players[key].socket.emit('mapZone', map.sendWorldByPlayerMove(world, players[key].poss.x, players[key].poss.y));
		}
	}
}, 1000);

IA.set({ players : Players, io : io });
IA.engine();