'use strict';

module.exports = {
	config : {
		mapSize : {
			x : 100000,
			y : 100000
		},

		map : {
			nbAsteroides : 500,
			AsteroidesEspace : { min : 400, max : 500 }
		}
	},

	// Vérification fin de map
	movePlayer : function (data) {
		//console.log(data.donnees.x);
		if (
			// X
			data.donnees.x > this.config.mapSize.x ||
			data.donnees.x < -this.config.mapSize.x ||
			// Y
			data.donnees.y > this.config.mapSize.y ||
			data.donnees.y < -this.config.mapSize.y
			) {

			data.force = true;

			if (data.donnees.x > this.config.mapSize.x) {
				data.donnees.x = -data.donnees.x;
				data.donnees.x += 5;
				return data;
			}
			if (data.donnees.x < -this.config.mapSize.x) {
				data.donnees.x = Math.abs(data.donnees.x);
				data.donnees.x -= 5;
				return data;
			}

			if (data.donnees.y > this.config.mapSize.y) {
				data.donnees.y = -data.donnees.y;
				data.donnees.y += 5;
				return data;
			}
			if (data.donnees.y < -this.config.mapSize.y+5) {
				data.donnees.y = Math.abs(data.donnees.y);
				data.donnees.y -= 5;
				return data;
			}

			console.log(data.donnees.x);
		}

		return data;
	},

	// Déplacement des bales sur la map.
	moveBullet : function (data) {
		console.log(data);
		return data;
	},

	random : function (min, max) {
		return min + Math.floor(Math.random()*(max-min));
	},

	getRandomAsteroids : function () {
		return this.random(this.config.map.AsteroidesEspace.min, this.config.map.AsteroidesEspace.max);
	},

	genMap : function () {
		var finalMap = [];

		var backgrounds = [
			'backgroundRedBlue',
			'backgroundOrangeBlue',
			'backgroundVioletVert',
			'backgroundOrangeViolet',
			'backgroundOraViolet',
			'MapBackgroundImage'
		];

		var planetes = [
			'planeteBlue',
			'planeteVenus',
			'planeteEarth',
			'planeteMars',
			'planeteJupiter',
			'planeteSaturn',
			'WorldImage',
			'planeteNeptune'
		]

		var asteroides = [
			'asteroide',
			'asteroideBlue',
			'asteroidesBare',
			'asteroidesGroupe',
			'asteroideSeul',
		]

		// X
		for (var y = 0; y <= this.config.mapSize.x; y += 500) { // Par bande de 500px

			for (var x = this.getRandomAsteroids(); x <= this.config.mapSize.x; x += this.getRandomAsteroids()) {
				
				var yGen = this.random(y, y+500);
				finalMap.push({ 
					x : x, 
					y : yGen, 
					imageName : asteroides[this.random(0, 5)] 
				});

			};
		};

		return finalMap;

	},

	saveMap : function (name, map) {
		var fs = require('fs');
		var writeStream = fs.createWriteStream(__dirname+'/../Worlds/'+name+'.json');
		writeStream.write(JSON.stringify(map));
		writeStream.close();
	},

	getDistanceElements : function(x, y, x2, y2)
	{
		return Math.sqrt(Math.pow((x - x2), 2) + Math.pow((y - y2), 2));
	},

	sendWorldByPlayerMove : function(world, x, y) {
		var listToReturn = [];
		for (var key in world) {
			if (this.getDistanceElements(world[key].x, world[key].y, x, y) < 1000) {
				listToReturn.push(world[key]);
			}
		}
		console.log(listToReturn);
		return listToReturn;
	}

};
