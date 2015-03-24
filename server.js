// Serveur MultiPlayer
'use strict';
===
var _server = require('./scripts_server/Server.js')();

_server.init();

setTimeout(function () { _server.webServer(); }, 0); // Start du WebServer
setTimeout(function () { _server.ioServer(); }, 0); // Stard du serveur IO.
setTimeout(function () { _server.mapServer(); }, 0); // Stard du serveur IO.
setTimeout(function () { _server.iaServer(); }, 0); // Gestion de l'IA
>
