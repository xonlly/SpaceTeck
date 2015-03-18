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
			nb : 1,
			spawnDist : 500,
			keyLabel : 'kbot',
		}
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
		}.bind(this), 1000);

		return this;
	},

	prepare : function () {
		var Players = this.config.obj.players;
		for (var i = 1; i <= this.config.bot.nb; i++) {
			this.config.bot.spawnDist += 200;
			Players.set(this.config.bot.keyLabel+i, this.config.bot.spawnDist);
			Players.config.players[this.config.bot.keyLabel+i].pseudo = this.config.bot.name+i;
		};
	},

	draw : function () {
		var Players = this.config.obj.players;
		for (var i = 1; i <= this.config.bot.nb; i++) {
			if (Math.floor((Math.random() * 2)+1) == 2) {
				Players.config.players[this.config.bot.keyLabel+i].vitesse += Players.config.players[this.config.bot.keyLabel+i].vitesse > 15 ? 15 : Math.floor((Math.random() * 2)+1);
				Players.config.players[this.config.bot.keyLabel+i].mouse.orientation = Players.config.players[this.config.bot.keyLabel+i].orientation += Math.floor((Math.random() * 35) + 1);;
			} else {
				Players.config.players[this.config.bot.keyLabel+i].mouse.orientation = Players.config.players[this.config.bot.keyLabel+i].orientation -= Math.floor((Math.random() * 35) + 1);;
				Players.config.players[this.config.bot.keyLabel+i].vitesse -= Players.config.players[this.config.bot.keyLabel+i].vitesse < 0 ? 0 : Math.floor((Math.random() * 2)+1);
			}

			if (Math.floor((Math.random() * 2)+1) == 2) {
				//GameObject.Bullet.set(btName+i);
			}
			Players.update(i, Players.config.players[this.config.bot.keyLabel+i]);
			this.config.obj.io.emit('player', { pid: this.config.bot.keyLabel+i, donnees : Players.config.players[this.config.bot.keyLabel+i] });
		}
	}
};
