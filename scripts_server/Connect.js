'use strict';

module.exports = function () {
  var Connect = {
    players : [],
    io : false,

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

    }
  };

  return Connect;
};
