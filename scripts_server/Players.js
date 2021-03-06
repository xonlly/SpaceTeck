'use strict';

module.exports = {
	config : {
		debug : false,
		ready : false,
		players : {},
		nbPlayers : 0,
		playerSpawn : 0,
		playerSpawnDist : 200,
	},

	imagestoLoadMapping : {
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
		iaParcourTest : 'iaParcourTest.png',
	},

	imagesMapping : {},
	world : {},
	playerObjects : {},

	_Map : require('../scripts_server/Map.js'),

	get : function (pid)
	{
		return this.config.players[pid];
	},

	update : function (pid, arr)
	{
		this.config.players[pid] = arr;
		return this;
	},

	getMappingFile : function (key) {
		var fs = require('fs');
		var obj = JSON.parse(fs.readFileSync(__dirname+'/../Worlds/'+key+'.map', 'utf8'));
		return obj;
	},

	getMapping : function () {
		for (var key in this.imagestoLoadMapping) {
			this.imagesMapping[key] = this.getMappingFile(key);
		}
	},

	engine : function ()
	{
		if (this.config.ready) { return; } else { this.config.ready = true; }

		this.getMapping();
		this.world = this._Map.getMap();
	//	console.log(this.world);

		setInterval(function () {
			if(this.config.nbPlayers == 0) { return; }
			this.refresh();
		}.bind(this), 1000 / 40);

		setInterval(function () {
			this.genPlayersMapping();
		}.bind(this), 3000);

		return this;
	},

	refresh : function ()
	{
		var player = this.config.players;
		for (var key in player) {
			var object;
			if ((object = this.Physicx.isColision(player[key].x, player[key].y, 30, key, this.world))) {
				if (!player[key].colision) {
			  	this.config.players[key].orientation += 180;
					//GameObject.Player.removeLife(key, 25);
				}
				player[key].colision = true;
			} else {
				player[key].colision = false;
			}

			this.config.players[key].x += Math.cos((this.config.players[key].orientation)*Math.PI/180) * -this.config.players[key].vitesse;
			this.config.players[key].y += Math.sin((this.config.players[key].orientation)*Math.PI/180) * -this.config.players[key].vitesse;

			// Temporaire, juste pour évité les sortie de map des bots.
			if (this.config.players[key].x > 100000 || this.config.players[key].x < -100000) { this.config.players[key].x = 0 };
			if (this.config.players[key].y > 100000 || this.config.players[key].y < -100000) { this.config.players[key].y = 0 };

			this.config.players[key].vitesse = this.Physicx.getVitesseByOrientation(
				this.config.players[key].orientation, this.config.players[key].orientation, this.config.players[key].vitesse
			);
		}
	},

	getAll : function ()
	{
		return this.config.players;
	},

	genPlayersMapping : function () {
		var world = this.world;
		var players = this.config.players;
		for (var keyP in players) {
			if (!players[keyP].bot) { continue; }
			this.playerObjects[keyP] = [];
			for (var key in world) {
				var planDist = Math.sqrt(Math.pow((world[key].x - players[keyP].x), 2) + Math.pow((world[key].y - players[keyP].y), 2));
				if (planDist < 1000) {
					this.playerObjects[keyP].push(world[key]);
					//console.log(world[key]);
				}
			}
		}

		//console.log(this.playerObjects);
	},

	Physicx :
	{
		isColision : function (x, y, objectSize, playerid, world)
		{
			var elementSize = objectSize == undefined ? 0 : objectSize;
			//playerid = playerid == undefined ? GameObject.Player.config.me : playerid;
			// Colision avec des items autres:
		/*	for (var key in listItems) {
				if (listItems[key].isMe) {
					if (GameObject.Player.isActive(key)) { continue; }
				}

				if (listItems[key].isMe == playerid) {
					continue;
				}

				shipDist = Math.sqrt(Math.pow((listItems[key].x - x), 2) + Math.pow((listItems[key].y - y), 2));
				if (shipDist - elementSize < listItems[key].distance && shipDist != 0) {
					return key;
				}

			}*/

			// Colision avec la map:

		  var	playerObjects = module.exports.playerObjects[playerid];

			for (var key in playerObjects) {
			//	console.log( playerObjects[key]);

				var nWidth = playerObjects[key].size.width/2;
				var nHeight = playerObjects[key].size.height/2;
			//	console.log(playerObjects);

				var shipDist = Math.sqrt(Math.pow((playerObjects[key].x - x), 2) + Math.pow((playerObjects[key].y - y), 2));
				if (shipDist < nWidth + 30 && shipDist != 0) {
					var imageMapped = module.exports.imagesMapping[playerObjects[key].imageName];
					//console.log(imageMapped)
					for (var keyMap in imageMapped.map) {
						var shipDistMap = Math.sqrt(Math.pow((playerObjects[key].x - nWidth + imageMapped.map[keyMap].x - x), 2) + Math.pow((playerObjects[key].y - nHeight + imageMapped.map[keyMap].y - y), 2));
						//console.log(shipDistMap);
						if (shipDistMap - elementSize < 10 && shipDistMap != 0) {
							//console.log('ici !!');
							return key;
						}
					}
				}
			}
		},



		getGravityEffect : function (x, y, vitesse, orientation)
		{
			for (var key in listItems) {

				if (listItems[key].isMe) {
					if (GameObject.Player.isActive(key)) { continue; }
				}

				if (listItems[key].isMe == GameObject.Player.config.me) {
					continue;
				}
				if (!listItems[key].gravity) {
					continue;
				}

				shipDist = Math.sqrt(Math.pow((listItems[key].x - x), 2) + Math.pow((listItems[key].y - y), 2));
				orentationZone = GameObject.Math.getAngleByPositions(x, y, listItems[key].x, listItems[key].y)/0.5;

				if (shipDist - elementSize < listItems[key].distance+listItems[key].gravityRadius && shipDist != 0) {
					//vitesse ++;
					//force = (((shipDist-listItems[key].distance)/listItems[key].gravityRadius)*1.9)*4;
					force = 5;
					newOrientation = orientation - orentationZone / 23;
					x +=
						(Math.cos((orientation)*Math.PI/180) +
						Math.cos((orentationZone)*Math.PI/180)/force)/2 *
						-vitesse;z

					y +=
						(Math.sin((orientation)*Math.PI/180) +
						Math.sin((orentationZone)*Math.PI/180)/force)/2 *
						-vitesse;

					vitesse = GameObject.Physicx.getVitesseByOrientation(
						orientation, newOrientation, vitesse
						);

					return {
						x: x,
						y: y,
						orientation: newOrientation,
						vitesse: vitesse
					};
				}

			}

			return {
				x: x,
				y: y,
				orientation: orientation,
				vitesse: vitesse
			};
		},

		getVitesseByOrientation : function (lastOrientation, newOrientation, vitesse)
		{
			if (lastOrientation == newOrientation) { // Aucun changement.
				return vitesse;
			}

			if (lastOrientation != 0) {
				rotationLevel = Math.abs(((newOrientation)*Math.PI/180) - (lastOrientation)*Math.PI/180)

				if (rotationLevel > 180) {
					rotationLevel -= 180;
				}

				newSpeed = vitesse - ((Math.abs(rotationLevel) / 180) * vitesse)*1;

				return newSpeed > 0 ? newSpeed : 0;
			}
			return vitesse;
		},
		addVect : function (obj, angle, force)
        {

            /*var vectR = {angle : 0, vitesse: 0};
            vectR.vitesse = Math.sqrt(obj.vitesse*obj.vitesse + force*force - 2*obj.vitesse*force * Math.cos(angle));
            vectR.vitesse = obj.vitesse;
            console.log((obj.orientation - obj.mouse.orientation));

            var a = obj.mouse.orientation - obj.orientation;
			a += (a>180) ? -360 : (a<-180) ? 360 : 0;

            var fdsvjiop = (obj.vitesse * obj.vitesse) + (vectR.vitesse*vectR.vitesse) - (2*obj.vitesse*vectR.vitesse) * Math.cos(a);

            console.log(fdsvjiop);

            //vectR.angle = Math.cos(((obj.vitesse * obj.vitesse) + (vectR.vitesse*vectR.vitesse) - (fdsvjiop*fdsvjiop)) / (2*obj.vitesse*vectR.vitesse));
            vectR.angle = Math.cos(obj.vitesse * obj.vitesse + vectR.vitesse*vectR.vitesse - fdsvjiop*fdsvjiop / 2*obj.vitesse*vectR.vitesse) * Math.PI / 180;
            return vectR;*/
        },

	},

	set : function (id, spawn)
	{
		if (spawn != undefined) {
			this.config.spawnCurrent = spawn;
		} else {
			this.config.spawnCurrent +=  this.config.spawnDist;
		}
		this.config.players[id] = {
			x: 100,
			y: this.config.spawnCurrent,
			vitesse: 0,
			orientation: 0,
			lastorientation: 0,
			frame: {},
			pseudo: 'NaaaN',
			mouse: {
				x:0,
				y:0,
				orientation:0,
				original: {
					x: 0,
					y: 0
				}
			},
			stats: {
				life: 100,
				mana: 100
			},
			die: false,
			demage: false,
			spawn: {
				x: 100,
				y: spawn
			},
			masse: 500 // ko
		};

		return this.config.players[id];
	},

	respawn : function (pid)
	{
		current = this.config.players[pid];
		this.config.players[pid].x = current.spawn.x;
		this.config.players[pid].y = current.spawn.y;
		this.config.players[pid].stats.life = 100;
		this.config.players[pid].stats.mana = 100;
		this.config.players[pid].vitesse = 0;
		this.config.players[pid].orientation = 0;
		this.config.players[pid].die = false;
	},

	die : function (pid)
	{
		if (this.config.players[pid] != undefined) {
			if (this.config.players[pid].die) {
				return;
			}

			this.config.players[pid].die = true;
			this.config.players[pid].vitesse = 0;
		}
	},

	removeLife : function (pid, deg)
	{
		if (this.config.players[pid]) {
			if (this.config.players[pid].stats.life <= 1) {
				this.die(pid);
				return;
			}

			if (this.config.players[pid].stats.mana > 0) {
				this.config.players[pid].stats.mana -= deg;
			} else {
				this.config.players[pid].stats.life -= deg;
			}

			this.config.players[pid].demage = true;
		}
	},
};
