'use strict';

module.exports = function () {

  var Gen = {

    _Map     : require('../scripts_server/Map.js'),
    _Mapping : require('../scripts_server/ImageMapping.js'),

    Generate : function (argv) {
    	if (argv == 'map') {
    		Gen._Map.saveMap('default', Gen._Map.genMap());
    	}

    	if (argv == 'mapping') {
        Gen._Mapping.prepare();
        Gen._Mapping.setImages({
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
    		});
        Gen._Mapping.genImagesContact();
    	}
    	console.log('Finish GEN');
    }
  };

  return Gen;
}
