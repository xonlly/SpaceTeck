'use strict';

module.exports = {
	config : {
		debug : false,
		ready : false,
		obj : {
			players : false,
			io : false,
		},
		bot : {
			name : 'Debile ',
			nb : 250,
			spawnDist : 100,
			keyLabel : 'kbot',
		}
	},

	trajectoires : {
		config : {
			limitsRadius : 150,
		},
		bots : {
			'kbot1' : {
				current : 0,
				max : 4,
				vitesse : 2,
				data : [
					{ x : 0, y : 0 },
					{ x : -1000, y: -1000 },
					{ x : 1000, y: -1000 },
					{ x : 1000, y: 1000 },
					{ x : -1000, y: 1000 },
				]
			},
			'kbot2' : {
				current : 0,
				max : 4,
				vitesse : 2,
				data : [
					{ x : 0, y : 0 },
					{ x : -2000, y: -2000 },
					{ x : 2000, y: -2000 },
					{ x : 2000, y: 2000 },
					{ x : -2000, y: 2000 },
				]
			},
			'kbot3' : {
				current : 0,
				max : 3,
				vitesse : 2,
				data : [
					{ x : -30000, y: -30000 },
					{ x : 30000, y: -30000 },
					{ x : 30000, y: 30000 },
					{ x : -30000, y: 30000 },
				]
			},
		},
	},

	set : function (obj) {
		this.config.obj.players = obj.players;
		this.config.obj.io 		= obj.io;

		return this;
	},

	engine : function () {
		if (this.config.ready) { return; } else { this.config.ready = true; }
		var Players = this.config.obj.players;

		// Préparation des obj:
		Players.engine();

		// Préparation des tableaux pour les players:
		this.prepare();

		// Execution du thread:
		setInterval(function () {
			this.draw();
			if (this.config.debug) { console.log(Players.config.players[this.config.bot.keyLabel+i]); }
		}.bind(this), 500);

		setInterval(function () { 
			this.engineSend(); 
		}.bind(this), 100);

		return this;
	},

	prepare : function () {
		var Players = this.config.obj.players;
		for (var i = 1; i <= this.config.bot.nb; i++) {
			this.config.bot.spawnDist += 200;
			Players.set(this.config.bot.keyLabel+i, this.config.bot.spawnDist);
			Players.config.players[this.config.bot.keyLabel+i].pseudo = this.config.bot.name+i;
			Players.config.players[this.config.bot.keyLabel+i].bot = true;
		};
	},

	draw : function () {
		var Players = this.config.obj.players;
		for (var i = 1; i <= this.config.bot.nb; i++) {
			// Déplacements:
			// console.log(this.config.bot.keyLabel+i);
			if (this.trajectoires.bots[this.config.bot.keyLabel+i]) {
				var botDeplacements = this.trajectoires.bots[this.config.bot.keyLabel+i];
				if (this.Math.getDistanceElements(
					botDeplacements.data[botDeplacements.current].x, 
					botDeplacements.data[botDeplacements.current].y, 
					Players.config.players[this.config.bot.keyLabel+i].x, 
					Players.config.players[this.config.bot.keyLabel+i].y
					) < this.trajectoires.config.limitsRadius) {

					console.log(botDeplacements.current +'>='+ botDeplacements.max);
					this.trajectoires.bots[this.config.bot.keyLabel+i].current = botDeplacements.current >= botDeplacements.max ? 0 : botDeplacements.current+1;

				}

				Players.config.players[this.config.bot.keyLabel+i].vitesse = botDeplacements.vitesse;
				Players.config.players[this.config.bot.keyLabel+i].mouse.orientation = Players.config.players[this.config.bot.keyLabel+i].orientation = this.Math.getAngleByPositions(
					Players.config.players[this.config.bot.keyLabel+i].x, 
					Players.config.players[this.config.bot.keyLabel+i].y,
					botDeplacements.data[botDeplacements.current].x, 
					botDeplacements.data[botDeplacements.current].y
					);
			} else {

				//console.log(Players.config.players[this.config.bot.keyLabel+i].x + ' - ' + Players.config.players[this.config.bot.keyLabel+i].y);

				
				if (Math.floor((Math.random() * 2)+1) == 2) {
					Players.config.players[this.config.bot.keyLabel+i].vitesse += Players.config.players[this.config.bot.keyLabel+i].vitesse > 2 ? 0 : Math.floor((Math.random() * 2)+1);
					Players.config.players[this.config.bot.keyLabel+i].mouse.orientation = Players.config.players[this.config.bot.keyLabel+i].orientation += Math.floor((Math.random() * 8) + 1) ;
				} else {
					Players.config.players[this.config.bot.keyLabel+i].mouse.orientation = Players.config.players[this.config.bot.keyLabel+i].orientation -= Math.floor((Math.random() * 8) + 1);
					Players.config.players[this.config.bot.keyLabel+i].vitesse -= Players.config.players[this.config.bot.keyLabel+i].vitesse < 0 ? 0 : Math.floor((Math.random() * 2)+1)  / 5;
				}

				if (Math.floor((Math.random() * 2)+1) == 2) {
					//GameObject.Bullet.set(btName+i);
				}
			}

			// Mise a jour des données recalculés.
			//console.log(Players.config.players[this.config.bot.keyLabel+i]);
			Players.update(this.config.bot.keyLabel+i, Players.config.players[this.config.bot.keyLabel+i]);

			
		}
	},

	engineSend : function ()
	{
		var Players = this.config.obj.players;
		var allPlayers = Players.config.players;
		for (var keyB in allPlayers) {
			if (!allPlayers[keyB].bot) { continue; }
			for (var keyP in allPlayers) {

				if (allPlayers[keyP].bot || !allPlayers[keyP].poss) { continue; } // Ont n'envoi pas au bots :D

				if (this.Math.getDistanceElements(
					allPlayers[keyP].poss.x,
					allPlayers[keyP].poss.y,
					allPlayers[keyB].x,
					allPlayers[keyB].y
					) < 3000) {
					//console.log(keyB);
					allPlayers[keyP].socket.emit('player', { pid: keyB, donnees : allPlayers[keyB] });
				}
			}
		}
	},

	Math :
	{
		getAngleByPositions : function (x, y, x2, y2)
		{
			var dy = y - y2;
			var dx = x - x2;
			var intReturn = Math.atan2(dy, dx);
			intReturn *= 180/Math.PI // rads to degs
			return intReturn;
		},

		getDistanceElements : function(x, y, x2, y2)
		{
			return Math.sqrt(Math.pow((x - x2), 2) + Math.pow((y - y2), 2));
		},

	},
};
