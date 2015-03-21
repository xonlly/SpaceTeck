'use strict';

module.exports = function () {

  var Server = {

    _express : false,
    _app : false,
    _server : false,
    _io : false,
    _connect : false,
    _Players : require('../scripts_server/Players.js'),
    _Map     : require('../scripts_server/Map.js'),
    _Gen     : require('../scripts_server/Gen.js')(),
    _IA      : require('../scripts_server/IA.js')(),
    _Sounds  : require('../scripts_server/Sounds.js')(),

    init : function () {
      this._express = require('express');
      this._app = this._express();
      this._server = require('http').Server(this._app);
      this._io = require('socket.io')(this._server);
      this._connect = require('../scripts_server/Connect.js')();

      if (process.argv[2] == 'gen') {
        Server._Gen.Generate(process.argv[3]);
      }
    },

    webServer : function () {

      var server  = this._server;
      var app     = this._app;
      var express = this._express;

      // Port du serveur
      this._server.listen(8183);

      // Ajout de headers:
      app.use(function (req, res, next) {
      	res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
      	res.header("Access-Control-Allow-Credentials", "false");
      	res.header("X-Engine", "Devteck-Engine");
      	next();
      });

      // Serveur static pour l'interface.
      app.use(express.static(__dirname+'/../'));

      // Send list sound
      app.get('/sounds/*', function (req, res) {
        console.log(req._parsedOriginalUrl.href);

        if (req._parsedOriginalUrl.href=='/sounds/effects/') {
          Server._Sounds.getListSoundEffects(function (list) {
            res.send(JSON.stringify(list));
          });
        } else {
          res.send('err');
        }
      });

    },

    ioServer : function () {

      var io      = this._io;
      var connect = this._connect;

      // Ajout de headers sur les sockets.
      io.use(function(socket, next){
      	socket.request.headers['X-Engine'] = 'Socket-Devteck-Engine';
      	socket.request.headers['Access-Control-Allow-Credentials'] = 'false';
      	next();
      });

      // Nouveau utilisateur sur les sockets:
      io.on('connection', function (socket) {
        connect.user(socket);
      });
      connect.global(io);
    },

    mapServer : function () {
      var world = Server._Map.getMap();
      setInterval(function () { // Envoi de la map pour chaque player
        // Juste pour les perfs
        if (Server._Players.config.nbPlayers == 0) { return; }

      	var players = Server._Players.config.players;
      	for (var key in players) {
          // Pour ne pas envoyer la map au bots ...
      		if (players[key].bot) { continue; }

      		if (typeof players[key].poss != 'undefined') {
      			players[key].socket.emit(
              'mapZone',
              Server._Map.sendWorldByPlayerMove(world, players[key].poss.x, players[key].poss.y)
            );
      		}
      	}
      }.bind(this), 1000);
    },

    iaServer : function () {
      Server._IA.engine();
    },

  };

  return Server;

};
