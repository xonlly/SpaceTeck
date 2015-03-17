'use strict';

module.exports = {

	vars : {
		pngjs : false,
		images : {}
	},
	prepare : function () {
		this.vars.pngjs = require('png-js');
	},

	convertToJson : function (imageName, name, callback) {
		var image = new this.vars.pngjs.load(imageName);
		var width 	= image.width;
		var height 	= image.height;
		var array 	= [];

		image.decode(function (pixel) {
			for (var y = 0; y < height; y++) {
	        	for (var x = 0; x < width; x++) {
	        		var idx = (width * y + x) << 2;
	        		var rgba = { 
	        			r: pixel[idx], 
	        			g: pixel[idx+1], 
	        			b: pixel[idx+2], 
	        			a: pixel[idx+3]
	        		};
	        		var pixelZone = { x: x, y: y, rgba : rgba};
	        		if (rgba.a > 120 && x % 10 == false && y % 10 == false) {
						array.push({x: x, y: y});
					}
				}
			}
			
			console.log('Mapping '+imageName+' '+array.length+' pixels ready');

			// Speed Test
			/*console.log('SpeedStart');
			for (var key in array) {
				if (array[key].x == 403 && array[key].y == 779) {
					console.log('inpact !');
				}
			}
			console.log('SpeedEnd');*/
			callback.call(this, name, array);
		});
	},

	setImages : function (arr) {
		this.vars.images = arr;
	},
	
	saveMapping : function (name, map) {
		var fs = require('fs');
		fs.writeFileSync(__dirname+'/../Worlds/'+name+'.map', JSON.stringify({name: name, map: map }));
	},

	genImagesContact : function () {
		var listImages = this.vars.images;
		for (var key in listImages) {
			this.convertToJson(
				__dirname+'/../images/'+listImages[key],
				key,
				function (name, data) {
					this.saveMapping(name, data);
				}.bind(this));
			
		}
	}



}
