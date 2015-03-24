'use strict';

module.exports = function () {
  var Sound = {
    // Req
    walker : require('walk'),

    getListSoundMusiques : function (callback) {
      var walker  = this.walker.walk('./sounds/audio', { followLinks: false });
      var files   = [];

      walker.on('file', function(root, stat, next) {
          // Add this file to the list of files
          files.push(root.replace('./sounds\\', '/sounds/') + '/' + encodeURI(stat.name));
          next();
      });

      walker.on('end', function() {
        callback.call(this, files);
      });

      return;
    },

    getListSoundEffects : function (callback) {
      var walker  = this.walker.walk('./sounds/effects', { followLinks: false });
      var files   = [];

      walker.on('file', function(root, stat, next) {
          // Add this file to the list of files
          files.push({name: stat.name.replace('.mp3', ''), link : root.replace('./sounds/', '/sounds/') + '/' + encodeURI(stat.name)});
          next();
      });

      walker.on('end', function() {
        callback.call(this, files);
      });

      return;
    },
  }

  return Sound;
};
