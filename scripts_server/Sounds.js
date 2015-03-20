'use strict';

module.exports = {

  // Req
  walker : require('walk'),
  test : [],

  setTest : function () {
    this.test.push('lol');
  },

  getListSound : function (callback) {
    console.log(this.test);
    var walker  = this.walker.walk('./sounds', { followLinks: false });
    var files   = [];


    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        files.push(root + '/' + stat.name);
        next();
    });

    walker.on('end', function() {
      callback.call(this, files);
    });

    return;
  },


};
