'use strict';

module.exports = {
	config : {
		mapSize : {
			x : 100000,
			y : 100000
		}
	},
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

	moveBullet : function (data) {
		console.log(data);
		return data;
	}
};
