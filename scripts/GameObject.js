GameObject = {
	MapServeur : {},
	addListener : function () {

		document.addEventListener("mousemove", function (e) {
			this.moveCurrentEvent(e);
		}.bind(this));

		document.addEventListener("keydown", function (e) {
			this.Keyboard.set(e, 'down');
		}.bind(this));

		document.addEventListener("keypress", function (e) {
			//e.preventDefault();
			if (e.charCode == 114) {
				if (player[GameObject.Player.config.me].die) {
					GameObject.Player.respawn(GameObject.Player.config.me);
				}
			}
		}.bind(this));

		document.addEventListener("keyup", function (e) {
			this.Keyboard.set(e, 'up');
		}.bind(this));

		document.addEventListener("click", function (e) {
			e.preventDefault();
			this.Bullet.set(GameObject.Player.config.me);

		}.bind(this));

		// Préparation de l'interface utilisateur
		VisualObject.drawInterface();

		setInterval(function () {
			GameObject.Player.regenMana();
		}, 1000);

		setInterval(function () {
			VisualObject.drawInterfaceVariables();
		}, 500);

		Tchat.init();

		return this;
	},


	Bullet :
	{
		config : {
			intBullet : 0,
			arrList : []
		},

		set : function (pid)
		{
			if (GameObject.Player.isActive(pid)) { return; }

			this.config.intBullet++;
			if (this.config.intBullet > 200) { this.config.intBullet = 1; }
			this.config.arrList[this.config.intBullet] = {
				x: player[pid].x,
				y: player[pid].y,
				pid: pid,
				vitesse: player[pid].vitesse + 30,
				orientation: player[pid].mouse.orientation,
				life: 150,
				deleted: false,
				dega: 10
			};
			socket.emit('bullet', {key: this.config.intBullet, donnees: this.config.arrList[this.config.intBullet]});
		},

		update : function ()
		{
			for (var key in this.config.arrList) {
				if (object = GameObject.Physicx.isColision(this.config.arrList[key].x, this.config.arrList[key].y, 1, this.config.arrList[key].pid)) {
					GameObject.Player.removeLife(object, this.config.arrList[key].dega);
					this.config.arrList[key] = {};
					continue;
				}

				if (this.config.arrList[key].life<=0) {
					this.config.arrList[key] = {};
				} else {
					this.config.arrList[key].x += Math.cos((this.config.arrList[key].orientation)*Math.PI/180) * -this.config.arrList[key].vitesse;
					this.config.arrList[key].y += Math.sin((this.config.arrList[key].orientation)*Math.PI/180) * -this.config.arrList[key].vitesse;

					newPoss = GameObject.Physicx.getGravityEffect(this.config.arrList[key].x, this.config.arrList[key].y, this.config.arrList[key].vitesse, this.config.arrList[key].orientation);

					this.config.arrList[key].x = newPoss.x;
					this.config.arrList[key].y = newPoss.y;
					this.config.arrList[key].orientation = newPoss.orientation;
					this.config.arrList[key].vitesse = newPoss.vitesse;

					this.config.arrList[key].x2 = (this.config.arrList[key].x-10) + Math.cos((this.config.arrList[key].orientation)*Math.PI/180) * -this.config.arrList[key].vitesse;
					this.config.arrList[key].y2 = (this.config.arrList[key].y-10) +  Math.sin((this.config.arrList[key].orientation)*Math.PI/180) * -this.config.arrList[key].vitesse;

					this.config.arrList[key].life--;
				}
			}
		},

		/**
		 * Clean this bullet removed by thread 1
		 */
		clean : function () {
			for (var key in this.config.arrList) {
				if (this.config.arrList[key].life == undefined || this.config.arrList[key].life == NaN) {
					delete this.config.arrList[key];
				}
			}
		}
	},

	Physicx :
	{
		isColision : function (x, y, objectSize, playerid)
		{
			elementSize = objectSize == undefined ? 0 : objectSize;
			playerid = playerid == undefined ? GameObject.Player.config.me : playerid;
			// Colision avec des items autres:
			for (var key in listItems) {
				if (listItems[key].isMe) {
					if (GameObject.Player.isActive(key)) { continue; }
				}

				if (listItems[key].isMe == playerid) {
					continue;
				}

				shipDist = Math.sqrt(Math.pow((listItems[key].x - x), 2) + Math.pow((listItems[key].y - y), 2));
				if (shipDist - elementSize < listItems[key].distance && shipDist != 0) {
					return key;
				}

			}

			// Colision avec la map:
			for (var key in GameObject.MapServeur) {
				var nWidth = (imagesLoaded[GameObject.MapServeur[key].imageName].image.width)/2;
				var nHeight = (imagesLoaded[GameObject.MapServeur[key].imageName].image.height)/2;

				shipDist = Math.sqrt(Math.pow((GameObject.MapServeur[key].x - x), 2) + Math.pow((GameObject.MapServeur[key].y - y), 2));
				if (shipDist < nWidth + 30 && shipDist != 0) {
					var imageMapped = imagesMapping[GameObject.MapServeur[key].imageName];
					for (var keyMap in imageMapped) {
						shipDistMap = Math.sqrt(Math.pow((GameObject.MapServeur[key].x - nWidth + imageMapped[keyMap].x - x), 2) + Math.pow((GameObject.MapServeur[key].y - nHeight + imageMapped[keyMap].y - y), 2));
						if (shipDistMap - elementSize < 10 && shipDistMap != 0) {
							return key;
						}
					}
				}
			}
		},

		getGravityEffect : function (x, y, vitesse, orientation)
		{
			for (var key in listItems) {

				if (listItems[key].isMe) {
					if (GameObject.Player.isActive(key)) { continue; }
				}

				if (listItems[key].isMe == GameObject.Player.config.me) {
					continue;
				}
				if (!listItems[key].gravity) {
					continue;
				}

				shipDist = Math.sqrt(Math.pow((listItems[key].x - x), 2) + Math.pow((listItems[key].y - y), 2));
				orentationZone = GameObject.Math.getAngleByPositions(x, y, listItems[key].x, listItems[key].y)/0.5;

				if (shipDist - elementSize < listItems[key].distance+listItems[key].gravityRadius && shipDist != 0) {
					//vitesse ++;
					//force = (((shipDist-listItems[key].distance)/listItems[key].gravityRadius)*1.9)*4;
					force = 5;
					newOrientation = orientation - orentationZone / 23;
					x +=
						(Math.cos((orientation)*Math.PI/180) +
						Math.cos((orentationZone)*Math.PI/180)/force)/2 *
						-vitesse;

					y +=
						(Math.sin((orientation)*Math.PI/180) +
						Math.sin((orentationZone)*Math.PI/180)/force)/2 *
						-vitesse;

					vitesse = GameObject.Physicx.getVitesseByOrientation(
						orientation, newOrientation, vitesse
						);

					return {
						x: x,
						y: y,
						orientation: newOrientation,
						vitesse: vitesse
					};
				}

			}

			return {
				x: x,
				y: y,
				orientation: orientation,
				vitesse: vitesse
			};
		},

		getVitesseByOrientation : function (lastOrientation, newOrientation, vitesse)
		{
			if (lastOrientation == newOrientation) { // Aucun changement.
				return vitesse;
			}

			if (lastOrientation != 0) {
				rotationLevel = Math.abs(((newOrientation)*Math.PI/180) - (lastOrientation)*Math.PI/180)

				if (rotationLevel > 180) {
					rotationLevel -= 180;
				}

				newSpeed = vitesse - ((Math.abs(rotationLevel) / 180) * vitesse)*1;

				return newSpeed > 0 ? newSpeed : 0;
			}
			return vitesse;
		},

	},

	Math :
	{
		getAngleByPositions : function (x, y, x2, y2)
		{
			dy = y - y2;
			dx = x - x2;
			intReturn = Math.atan2(dy, dx);
			intReturn *= 180/Math.PI // rads to degs
			return intReturn;
		},

		getDistanceElements : function(x, y, x2, y2)
		{
			return Math.sqrt(Math.pow((x - x2), 2) + Math.pow((y - y2), 2));
		},

	},

	Keyboard :
	{
		push : function ()
		{
			for (var keyCode in listKeysPush) {
				switch (listKeysPush[keyCode]) {
					case 90:
					case 38: // Up

						if (player[GameObject.Player.config.me].vitesse < 15) {
							player[GameObject.Player.config.me].vitesse += 0.35;
						}
						player[GameObject.Player.config.me].lastorientation = player[GameObject.Player.config.me].orientation;
						player[GameObject.Player.config.me].orientation 	= player[GameObject.Player.config.me].mouse.orientation;
					break;

					case 83:
					case 40: // Down
						if (player[GameObject.Player.config.me].vitesse > -5) {
							player[GameObject.Player.config.me].vitesse -= 0.6;
						}
						//player[GameObject.Player.config.me].lastorientation = player[GameObject.Player.config.me].orientation;
						//player[GameObject.Player.config.me].orientation = player[GameObject.Player.config.me].mouse.orientation;
					break;

					case 37: // Left

					break;

					case 39: // Right

					break;

					case 32: // Espace
						GameObject.Bullet.set(GameObject.Player.config.me);
					break;
				};
			}
		},

		set : function (e, etat)
		{
			if (etat == 'down') { // Down
				listKeysPush[e.keyCode] = e.keyCode;
			} else { // UP
				delete listKeysPush[e.keyCode];
			}
		},

	},

	ItemsMap : {
		getDefaultArray : function ()
		{
			return {
				x: 0,
				y: 0,
				distance: 0,
				gravity: false,
				gravityRadius: 0,
				gravityLevel: 100,
				isMe: false
			};
		},

		setItem : function (name, arr)
		{
			listItems[name] = arr;
			return this;
		},

		upItem : function (name, arr)
		{
			listItems[name] = arr;
			return this;
		},

		getItem : function (name, arr)
		{
			return listItems[name];
		},

		moveItem : function (name, x, y)
		{
			item = this.getItem(name);
			item.x = x;
			item.y = y;
			this.upItem(name, item);
			return this;
		}
	},

	Player : {

		config: {
			me: false,
			spawnDist: 400,
			spawnCurrent : 50
		},

		notVisible : function (x, y)
		{

			if (GameObject.Math.getDistanceElements(x, y, player[this.config.me].frame.x, player[this.config.me].frame.y) > canvasWidth) {
				return true;
			}

			return false;
		},

		set : function (id, spawn)
		{
			if (spawn != undefined) {
				this.config.spawnCurrent = spawn;
			} else {
				this.config.spawnCurrent +=  this.config.spawnDist;
			}
			player[id] = {
				x: 100,
				y: this.config.spawnCurrent,
				vitesse: 0,
				orientation: 0,
				lastorientation: 0,
				frame: {},
				pseudo: 'NaaaN',
				mouse: {
					x:0,
					y:0,
					orientation:0,
					original: {
						x: 0,
						y: 0
					}
				},
				stats: {
					life: 100,
					mana: 100
				},
				die: false,
				demage: false,
				spawn: {
					x: 100,
					y: spawn
				},
				masse: 500 // ko
			};

			arrItem = GameObject.ItemsMap.getDefaultArray();
			arrItem.isMe = id;
			arrItem.x = 100,
			arrItem.y = this.config.spawnCurrent,
			arrItem.distance = 30;
			GameObject.ItemsMap.setItem(id, arrItem);

			return player[id];
		},

		respawn : function (pid)
		{
			current = player[pid];
			player[pid].x = current.spawn.x;
			player[pid].y = current.spawn.y;
			player[pid].stats.life = 100;
			player[pid].stats.mana = 100;
			player[pid].vitesse = 0;
			player[pid].orientation = 0;
			player[pid].die = false;
		},

		refresh : function ()
		{
			GameObject.mouseRefresh();
			for (var key in player) {
				if (GameObject.Player.isActive(key)
					// || GameObject.Player.notVisible(player[key].x, player[key].y)
					) { continue; }

				if ((object = GameObject.Physicx.isColision(player[key].x, player[key].y, 30, key))) {
					//GameObject.Player.removeLife(object, 1);
					if (!player[key].colision) {
						player[key].orientation = player[key].orientation + 180;
						GameObject.Player.removeLife(key, 25);
					}
					player[key].colision = true;
				} else {
					player[key].colision = false;
				}

				// Vérification de la distance pour l'arret des propulseurs.
				/*player[key].distance = Math.sqrt(Math.pow((player[key].x - player[GameObject.Player.config.me].mouse.x), 2) + Math.pow((player[key].y - player[GameObject.Player.config.me].mouse.y), 2));
				if (player[key].distance < 150 && player[key].vitesse > 0) {
				//	return;
				}*/

				if (player[key].lastorientation != 0 && !player[key].colision) {

					player[key].x +=
						(Math.cos((player[key].lastorientation)*Math.PI/180) +
						Math.cos((player[key].orientation)*Math.PI/180))/2 *
						-player[key].vitesse;

					player[key].y +=
						(Math.sin((player[key].lastorientation)*Math.PI/180) +
						Math.sin((player[key].orientation)*Math.PI/180))/2 *
						-player[key].vitesse;


				} else {
					player[key].x += Math.cos((player[key].orientation)*Math.PI/180) * -player[key].vitesse;
					player[key].y += Math.sin((player[key].orientation)*Math.PI/180) * -player[key].vitesse;
				}

				newPos = GameObject.Physicx.getGravityEffect(player[key].x, player[key].y, player[key].vitesse, player[key].orientation);
				player[key].x = newPos.x;
				player[key].y = newPos.y;
				player[key].vitesse = newPos.vitesse;
				player[key].orientation = newPos.orientation;

				player[key].vitesse = GameObject.Physicx.getVitesseByOrientation(player[key].lastorientation, player[key].orientation, player[key].vitesse);

				// Envoi des informations au ship.
				GameObject.ItemsMap.moveItem(key, player[key].x, player[key].y);
				player[key].frame = {
					x: player[key].x,
					y: player[key].y,
				};


			}

		},

		regenMana : function ()
		{
			for (var key in player) {
				if (GameObject.Player.isActive(key)) { continue; }

				if (player[key].stats.mana < 100) {
					player[key].stats.mana += 4;
					if (player[key].stats.mana > 100) {
						player[key].stats.mana = 100;
					}
				}

				if (key == GameObject.Player.config.me) {
					VisualObject.drawInterface();
				}
			}
		},

		isActive : function (pid)
		{
			if (player[pid].die) {
				return true;
			}

			return false;
		},

		die : function (pid)
		{
			if (player[pid].die) { return; }
			if (player[pid] != undefined) {
				if (pid != GameObject.Player.config.me) { // J'ai tué un player
					socket.emit('die', {player: player[pid], killed: player[GameObject.Player.config.me]});
				} else { // Je suis die

				}


				player[pid].die = true;
				player[pid].vitesse = 0;
			}
		},

		removeLife : function (pid, deg)
		{
			if (player[pid]) {
				if (player[pid].stats.life <= 1) {
					this.die(pid);
					return;
				}

				if (player[pid].stats.mana > 0) {
					player[pid].stats.mana -= deg;
				} else {
					player[pid].stats.life -= deg;
				}

				player[pid].demage = true;

				if (pid == GameObject.Player.config.me) {
					VisualObject.drawInterface();
				}
			}
		},
	},

	Multiplayer : {

		update : function (pid, arr)
		{
			player[pid] = arr;
			return this;
		}

	},


	init : {
		size : function () {
			height = document.clientHeight;
			width  = document.clientWidth;
		},
	},

	drawEngine : function ()
	{

		this.Player.refresh();
		if (GameObject.Player.config.me) {
			this.changeMouseAngle(GameObject.Player.config.me);
		}


		setTimeout(function () {
			this.WorldRotate();
		}.bind(this), 0);

		setTimeout(function () {
			this.Bullet.clean();
		}.bind(this), 0);

		setTimeout(function () {
			this.Bullet.update();
		}.bind(this), 0);
	},

	Engine : function () {
		var lastEmitArray = '';
		setInterval(function () {

			if (lastEmitArray != JSON.stringify(player[GameObject.Player.config.me])) {
				socket.emit('player', {pid: GameObject.Player.config.me, donnees: player[GameObject.Player.config.me]});
			}

			lastEmitArray = JSON.stringify(player[GameObject.Player.config.me]);
		}.bind(this), 100);

		setInterval(function () {
			// Gestion de l'appui des touches
			setTimeout(function () { this.Keyboard.push(); }.bind(this), 0);
		}.bind(this), 100);
	},



	WorldRotate : function () {
		degrees += 0.04;

		ctx.beginPath();
		if (ColorPlannet<10) {
			ColorDirection = false;
		}

		if (ColorPlannet > 130) {
			ColorDirection = true;
		}
		//console.log(ColorPlannet);
		if (!ColorDirection) {
			ColorPlannet += Math.floor((Math.random() * 2));
		} else {
			ColorPlannet -= Math.floor((Math.random() * 2));
		}
	},

	changeMouseAngle : function (pid) {
		player[pid].mouse.orientation = GameObject.Math.getAngleByPositions(
			player[pid].frame.x,
			player[pid].frame.y,
			player[pid].mouse.x,
			player[pid].mouse.y
		);
	},


	moveCurrentEvent : function (e) {
		if (GameObject.Player.config.me) {
			player[GameObject.Player.config.me].mouse.original.x = e.clientX;
			player[GameObject.Player.config.me].mouse.original.y = e.clientY;

			player[GameObject.Player.config.me].mouse.x = ((player[GameObject.Player.config.me].x - ctx.canvas.width/2) + e.clientX);
			player[GameObject.Player.config.me].mouse.y = ((player[GameObject.Player.config.me].y - ctx.canvas.height/2) + e.clientY);
		}
	},

	mouseRefresh : function ()
	{
		player[GameObject.Player.config.me].mouse.x = ((player[GameObject.Player.config.me].x - ctx.canvas.width/2) + player[GameObject.Player.config.me].mouse.original.x);
		player[GameObject.Player.config.me].mouse.y = ((player[GameObject.Player.config.me].y - ctx.canvas.height/2) + player[GameObject.Player.config.me].mouse.original.y);
	}

};
