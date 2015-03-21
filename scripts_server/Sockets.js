'use strict';

module.exports = function () {
  var Socket = {

    config : {
        debug : true,
    },

    io : false,
    _Connect : require('../scripts_server/Connect.js'),
    _Players : require('../scripts_server/Players.js'),
    _Map     : require('../scripts_server/Map.js'),

    init : function (io) {
      Socket.io = io;
    },

    getIO : function () {
      return Socket.io;
    },

    tchat : {
      connect : function (pseudo) {
        if (Socket.config.debug) { console.log('New utilisateur: ' + pseudo); }
        Socket.io.emit('tchat', {pseudo: "Serveur", msg: "Hello "+pseudo});
      },
    },

    game : {

      bullet : function (socket, data) {
    			data = Socket._Map.moveBullet(data);
          Socket.io.emit('bullet', data);
      },

      player : function (socket, data) {
        Socket._Players.config.players[socket.id]['poss'] = {
  				x : data.donnees.x,
  				y : data.donnees.y
  			};

  			data = Socket._Map.movePlayer(data);
        Socket.io.emit('player', data);
      },

      die : function (socket, data) {
        // Socket.io.emit('tchat', {pseudo: "Serveur", msg: data.player.pseudo + " kill " + data.killed.pseudo });
        Socket.io.emit('die', data);
      },

      disconnect : function (socket, data) {
        if (Socket.config.debug) { console.log('Disconnect : ' + socket.id); }
        delete Socket._Players.config.players[socket.id];
        Socket.io.emit('bay', { pid: socket.id });
      }

    },

    // Liste des listener
    newPlayer : function (socket) {

      Socket._Players.config.players[socket.id] = { socket: socket, pts: 0, cheat: 10 };
      Socket._Players.config.playerSpawn += Socket._Players.config.playerSpawnDist;
      socket.emit('hello', { id: socket.id, spawn: Socket._Players.config.playerSpawn });
      Socket._Players.config.nbPlayers++;

      socket.on('bullet', function (data) {
        Socket.game.bullet(socket, data);
      });

      socket.on('player', function (data) {
        Socket.game.player(socket, data);
      });

      socket.on('tchat', function (data) {
        Socket.io.emit('tchat', data);
      });

      socket.on('die', function (data) {
        Socket.game.die(socket, data);
      });

      socket.on('disconnect', function (data) {
        Socket._Players.config.nbPlayers--;
        Socket.game.disconnect(socket, data);
      });

    }
  };

  return Socket;
};
