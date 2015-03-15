'use strict';

module.exports = {

	pngjs : false,
	prepare : function () {
		this.pngjs = require('png-js');
	},

	convertToJson : function (imageName) {
		image = new this.pngjs.load(imageName);
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
	        		if (rgba.a > 120) {
						array.push(pixelZone);
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
			return array;
		});
	}



}
