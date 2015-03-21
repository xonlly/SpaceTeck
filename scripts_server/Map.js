'use strict';

module.exports = {
	config : {
		mapSize : {
			x : 200000,
			y : 200000
		},

		map : {
			nbAsteroides : 500,
			AsteroidesEspace : { min : 1400, max : 2500 },
			WorldEspace : { min : 5000, max : 6000 }
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

	getRandomWorld : function () {
		return this.random(this.config.map.WorldEspace.min, this.config.map.WorldEspace.max);
	},

	uniqueid : function (){
	    // always start with a letter (for DOM friendlyness)
	    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
	    do {
	        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
	        var ascicode=Math.floor((Math.random()*42)+48);
	        if (ascicode<58 || ascicode>64){
	            // exclude all chars between : (58) and @ (64)
	            idstr+=String.fromCharCode(ascicode);
	        }
	    } while (idstr.length<32);

	    return (idstr);
	},

	genMap : function () {
		var finalMap = [];

 		var imagesI = {
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
		};

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
		];

		var asteroides = [
			'asteroide',
			'asteroideBlue',
			'asteroidesBare',
			'asteroidesGroupe',
			'asteroideSeul',
		];
		var id = 0;
		var sizeOf = require('image-size');

		// X
		for (var y = -200000; y <= this.config.mapSize.x; y += 1500) { // Par bande de 500px
			for (var x = this.getRandomAsteroids()-100000; x <= this.config.mapSize.x; x += this.getRandomAsteroids()) {
				var yGen = this.random(y, y+1500);
				var pType = this.random(0, 5);
				var size = { width: 0, height: 0 };
				if (imagesI[asteroides[pType]]) {
					var image = sizeOf('./images/'+imagesI[asteroides[pType]]);
					size.width = image.width;
					size.height = image.height;
				}

				id++;
				finalMap.push({
					x : x,
					y : yGen,
					name : 'A'+pType+'-'+id,
					imageName : asteroides[pType],
					size: size
				});
			};
		};

		id = 0;
		for (var y = -200000; y <= this.config.mapSize.x; y += 5000) { // Par bande de 500px
			for (var x = this.getRandomWorld()-200000; x <= this.config.mapSize.x; x += this.getRandomWorld()) {
				var yGen = this.random(y, y+5000);
				var pType = this.random(0, 8);
				var size = { width: 0, height: 0 };
				if (imagesI[planetes[pType]]) {
					var image = sizeOf('./images/'+imagesI[planetes[pType]]);
					size.width = image.width;
					size.height = image.height;
				}

				id++;
				finalMap.push({
					x : x,
					y : yGen,
					name : 'W'+pType+'-'+id,
					imageName : planetes[pType],
					size: size
				});
			};
		};

		return finalMap;

	},

	getMap : function () {
		var fs = require('fs');
		var obj = JSON.parse(fs.readFileSync(__dirname+'/../Worlds/default.json', 'utf8'));
		return obj;
	},

	saveMap : function (name, map) {
		var fs = require('fs');
		fs.writeFileSync(__dirname+'/../Worlds/'+name+'.json', JSON.stringify(map));
	},

	getDistanceElements : function(x, y, x2, y2)
	{
		return Math.sqrt(Math.pow((x - x2), 2) + Math.pow((y - y2), 2));
	},

	sendWorldByPlayerMove : function(world, x, y) {
		var listToReturn = [];
		for (var key in world) {
			if (this.getDistanceElements(world[key].x, world[key].y, x, y) < 3000) {
				listToReturn.push(world[key]);
			}
		}
		//console.log(listToReturn);
		return listToReturn;
	}

};
