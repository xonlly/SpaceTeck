function CheckToStart() {
	LoadingCur++;
	document.querySelector("#loadingEtat").innerHTML = LoadingCur + '/' + LoadingNB + ' - '+(LoadingCur*100/LoadingNB).toFixed(0)+'%';
	if (LoadingCur == LoadingNB) {
		StartPlayer();
	}
}



function StartPlayer() {
	if (typeof io == 'undefined') {
		alert('Récupération du JS IO impossible :/');
	}

	socket = io('ws://'+document.location.hostname+':8183');
	if (typeof socket == 'undefined') {
		alert('Arf, impossible d\'ouvrir les sockets :(');
		return;
	}

	VisualObject.newMap();
	GameObject.init.size();
	Tchat.eventListener();
	// NodeJS server required.
	// For Multiplayer / Solo
	// Server gestion:
	
	socket.on('hello', function (data) {
		if (GameObject.Player.config.me) { return; }

		GameObject.Player.set(data.id, data.spawn);
		GameObject.Player.config.me = data.id;
		
		player[GameObject.Player.config.me].pseudo = document.querySelector("#pseudo").value;

		GameObject.addListener();
		GameObject.Engine();

	}.bind(GameObject));

	socket.on('bay', function (data) {
		GameObject.Player.die(data.pid);
	}.bind(GameObject));

	socket.on('bullet', function (data) {
		if (data.pid == GameObject.Player.config.me) { return; } // Don't me please !
		GameObject.Bullet.config.arrList[data.key] = data.donnees;
	}.bind(GameObject));

	socket.on('player', function (data) {
		if (data.pid == GameObject.Player.config.me && !data.force) { return; } // Don't me please x2 !
		if (player[data.pid] == undefined) {
			GameObject.Player.set(data.pid);
		}

		GameObject.Multiplayer.update(data.pid, data.donnees);

	}.bind(GameObject));

	socket.on('mapZone', function (data) {
		GameObject.MapServeur = data;
	});
};
