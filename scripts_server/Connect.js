'use strict';

module.exports = function () {
  var Connect = {
    players : [],
    io : false,

    _Sounds : require('../scripts_server/Sounds.js'),
    _Sockets : require('../scripts_server/Sockets.js')(),

    user : function (socket) {

      this.players.push({ socket: socket });
      this.onConnect(socket);

    },

    getIo : function () {
      return this.io;
    },

    global : function (io) {
      this.io = io;
      this._Sockets.init(io);
    },

    onConnect : function (socket) {
      var _Sockets = this._Sockets;
      _Sockets.tchat.connect(socket.id);
      _Sockets.newPlayer(socket);

      this._Sounds.getListSound(function (list) {
        socket.emit('sounds', list);
      });
    }
  };

  return Connect;
};
