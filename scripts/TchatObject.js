Tchat = {
	config : { 
		tchat : false 
	},

	init : function () {
		this.config.tchat = document.querySelector("#tchatZone");
		//this.eventListener();
	},

	eventListener : function ()
	{
		socket.on('tchat', function (data) {
			this.addMessage(data.pseudo, data.msg);
		}.bind(this));

		document.querySelector("#TextChat").addEventListener('keypress', function (e) {
			console.log(e);
			if (e.keyCode == 13) {
				this.pushMessage(player[GameObject.Player.config.me].pseudo, document.querySelector("#TextChat").value);
				document.querySelector("#TextChat").value = '';
			}
			return false;
		}.bind(this));

	},

	pushMessage : function (pseudo, msg)
	{
		socket.emit('tchat', {pseudo: pseudo, msg:msg});
		return this;
	},

	addMessage : function (pseudo, msg)
	{
		this.config.tchat.innerHTML += '<span class="msg"><b>'+pseudo+': </b> '+msg+'</span><br />';
	}

};
