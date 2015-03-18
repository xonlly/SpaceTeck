'use strict';

module.exports = {
	config : {
		debug : false,
		ready : false,
		players : {}
	},

	get : function (pid)
	{
		return this.config.players[pid];
	},

	update : function (pid, arr)
	{
		this.config.players[pid] = arr;
		return this;
	},

	engine : function ()
	{
		if (this.config.ready) { return; } else { this.config.ready = true; }

		setInterval(function () {
			this.refresh();
		}.bind(this), 40);

		return this;
	},

	refresh : function ()
	{
		for (var key in this.config.players) {
			this.config.players[key].x += Math.cos((this.config.players[key].orientation)*Math.PI/180) * -this.config.players[key].vitesse;
			this.config.players[key].y += Math.sin((this.config.players[key].orientation)*Math.PI/180) * -this.config.players[key].vitesse;
		}
	},

	getAll : function ()
	{
		return this.config.players;
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
}