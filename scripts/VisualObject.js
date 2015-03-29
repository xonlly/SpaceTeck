
var VisualObject = {
	config : {
		debug : false,
		imagesDebug : {},
	},

	newMap : function () {


        elem = document.querySelector("#gameZone");
		listMapsContext[1] = elem.getContext("2d");

    
		
        elem = document.querySelector("#gameInterface");
		listMapsContext[3] = elem.getContext("2d");

		ctx = listMapsContext[1]; // Save du context pour chaque player.

		/*if (this.config.debug) {
			for (var keyMap in imagesMapping) {
				this.config.imagesDebug[keyMap] = {};
				for (var keyPx in imagesMapping[keyMap]) {
					if (imagesMapping[keyMap][keyPx].x % 10 == false && imagesMapping[keyMap][keyPx].y % 10 == false) {
						this.config.imagesDebug[keyMap][keyPx] = { x: imagesMapping[keyMap][keyPx].x, y: imagesMapping[keyMap][keyPx].y };
					}
				}
			}
			console.log(this.config.imagesDebug);
		}*/

		ctx.canvas.width  = ForceSizeWidth || window.innerWidth-2;
			ctx.canvas.height = ForceSizeHeight || window.innerHeight-2;

            pattern = ctx.createPattern(imagesLoaded['EtoilesImage'].image, 'repeat');
            patternBg = ctx.createPattern(imagesLoaded['patternBackground'].image, 'repeat');

			listMapsContext[3].canvas.width  = ForceSizeWidth || window.innerWidth-2;
			listMapsContext[3].canvas.height = ForceSizeHeight || window.innerHeight-2;

			sizeZone = document.querySelector("#sizeZone");
		sizeZone.style = "width:"+listMapsContext[3].canvas.width+"px; height:"+listMapsContext[3].canvas.height+"px; position: absolute;";

		document.querySelector("#LoadDomZone").style = "display: none";

		canvasWidth 	= ctx.canvas.width;
		canvasHeight 	= ctx.canvas.height;

/*
		ctx2 = listMapsContext[2]; // Save du context pour chaque player.

		ctx2.canvas.width  = ForceSizeWidth || window.innerWidth-2;
			ctx2.canvas.height = ForceSizeHeight || window.innerHeight-2;

			ctx2.drawImage(
			imagesLoaded['patternBackground'].image, 
			0, 
			0
			);*/
		
	},

	drawMap : function () {
		ctx = listMapsContext[2];

		
	},

	drawInterfaceVariables : function ()
	{
		ctx = listMapsContext[3];
		ctx.save();
			ctx.clearRect (0, ctx.canvas.height - 120, 200, 50);
			ctx.lineWidth 	= 1;
			ctx.strokeStyle = "#039CAE";
			ctx.fillStyle 	= "#006975"
			ctx.font 		= 'italic 40pt Calibri';
			ctx.strokeText(player[GameObject.Player.config.me].vitesse.toFixed(0)*10 + "m/s", 10, ctx.canvas.height-80);
			ctx.stroke();
  			ctx.fill();
			ctx.beginPath();
		ctx.restore();

		ctx.clearRect (ctx.canvas.width/2-200, ctx.canvas.height/2 - 100, 400, 200);
		if (player[GameObject.Player.config.me].die) {
			ctx.save();
				ctx.lineWidth 	= 2;
				ctx.strokeStyle = "red";
				ctx.fillStyle 	= "#006975"
				ctx.font 		= 'italic 40pt Calibri';
				ctx.strokeText("Game over", ctx.canvas.width/2-100, ctx.canvas.height/2-50);
				ctx.stroke();
      			ctx.fill();

      			ctx.font 		= 'italic 20pt Calibri';
				ctx.strokeText("Press R to respawn", ctx.canvas.width/2-100, ctx.canvas.height/2-20);
				ctx.stroke();
      			ctx.fill();

				ctx.beginPath();
			ctx.restore();
		}
	},

	drawInterface : function () 
	{

		// Interface
		ctx = listMapsContext[3];
		ctx.clearRect (0, ctx.canvas.height - 70, ctx.canvas.width, 70);
		
		ctx.save();
			ctx.translate(0,  canvasHeight - 40);

			ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = "#039CAE";
				ctx.fillStyle = "#006975";
					ctx.moveTo(0, -5);
					ctx.lineTo(200, -5);
					ctx.bezierCurveTo(300, 30, 400, 15, 500, 20);
					ctx.lineTo(canvasWidth, 20);
					ctx.lineTo(canvasWidth, 40);
					ctx.lineTo(0, 40);
					ctx.lineWidth = 2;

					ctx.shadowColor = player[GameObject.Player.config.me].stats.mana < 10 ? 'red' : '#039CAE';
				ctx.shadowBlur = 20;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;

					ctx.stroke();
					ctx.fill();
				ctx.restore();

				ctx.beginPath();

			ctx.strokeStyle = "gray";
			ctx.moveTo(0, 5);
			ctx.lineTo(200, 5);
			ctx.lineWidth = 15;
			ctx.lineCap = 'round';
			ctx.stroke();
			ctx.beginPath();

			ctx.strokeStyle = "#CB0000";
			ctx.moveTo(0, 5);
			ctx.lineTo(player[GameObject.Player.config.me].stats.life*2, 5);
			ctx.lineWidth = 15;
			ctx.lineCap = 'round';
			ctx.stroke();
			ctx.beginPath();

			ctx.strokeStyle = "white";
			ctx.lineWidth = 1;
			ctx.strokeText("Structure " + player[GameObject.Player.config.me].stats.life + "%", 10, 8);
			ctx.stroke();
			ctx.beginPath();

			ctx.strokeStyle = "gray";
			ctx.moveTo(0, 20);
			ctx.lineTo(200, 20);
			ctx.lineWidth = 15;
			ctx.lineCap = 'round';
			ctx.stroke();
			ctx.beginPath();

			ctx.strokeStyle = "#0065C8";
			ctx.moveTo(0, 20);
			ctx.lineTo(player[GameObject.Player.config.me].stats.mana*2, 20);
			ctx.lineWidth = 15;
			ctx.lineCap = 'round';
			ctx.stroke();
			ctx.beginPath();

			ctx.strokeStyle = "white";
			ctx.lineWidth = 1;
			ctx.strokeText("Bouclier " + player[GameObject.Player.config.me].stats.mana + "%", 10, 24);
			ctx.stroke();
			ctx.beginPath();

			ctx.translate(0,  38);
			ctx.strokeStyle = "#B38400";
			ctx.moveTo(0, 0);
			ctx.lineTo(canvasWidth, 0);
			ctx.lineWidth = 15;
			//ctx.lineCap = 'round';
			ctx.stroke();
			ctx.beginPath();



		ctx.restore();
	},

	draw : function () {
		this.ctx = listMapsContext[1];

		ServeurItems = GameObject.Bullet.config.arrList;

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //this.ctx.clear(true);
		this.ctx.beginPath();

		this.ctx.save();

        
           /* this.ctx.save();
        
                this.ctx.translate(-player[GameObject.Player.config.me].frame.x / 10 + this.ctx.canvas.width / 2 - 20, -player[GameObject.Player.config.me].frame.y / 10 + this.ctx.canvas.height / 2);
                this.ctx.rect(player[GameObject.Player.config.me].frame.x / 10 - this.ctx.canvas.width / 2 - 20, player[GameObject.Player.config.me].frame.y / 10 - this.ctx.canvas.height / 2, this.ctx.canvas.width, this.ctx.canvas.height);
                //this.ctx.globalAlpha = 0.4;
                this.ctx.fillStyle = patternBg;
                this.ctx.fill();
            this.ctx.restore();*/
          // console.log('-' + (player[GameObject.Player.config.me].frame.x / 2 + this.ctx.canvas.width / 2 - 20) + 'px -' + (-player[GameObject.Player.config.me].frame.y / 2 + this.ctx.canvas.height / 2) + 'px');
           document.querySelector("#gameZone").style.backgroundPosition = '-'+ (player[GameObject.Player.config.me].frame.x / 10 + this.ctx.canvas.width / 2 - 20) + 'px -' + (player[GameObject.Player.config.me].frame.y / 10 + this.ctx.canvas.height / 2) + 'px';

			this.ctx.save();

				this.ctx.translate(-player[GameObject.Player.config.me].frame.x/4 + this.ctx.canvas.width/2 -20, -player[GameObject.Player.config.me].frame.y/4 + this.ctx.canvas.height/2);
				this.ctx.rect(player[GameObject.Player.config.me].frame.x/4 - this.ctx.canvas.width/2 -20, player[GameObject.Player.config.me].frame.y/4 - this.ctx.canvas.height/2, this.ctx.canvas.width, this.ctx.canvas.height);		
				this.ctx.globalAlpha = 0.4;
				this.ctx.fillStyle = pattern;
				this.ctx.fill();
			this.ctx.restore();

			this.ctx.save();
				this.ctx.translate(-player[GameObject.Player.config.me].frame.x/2 + this.ctx.canvas.width/2 -70, -player[GameObject.Player.config.me].frame.y/2 + this.ctx.canvas.height/2);
				this.ctx.rect(player[GameObject.Player.config.me].frame.x/2 - this.ctx.canvas.width/2 -70, player[GameObject.Player.config.me].frame.y/2 - this.ctx.canvas.height/2, this.ctx.canvas.width, this.ctx.canvas.height);		
				this.ctx.globalAlpha = 0.7;
				this.ctx.fillStyle = pattern;
				this.ctx.fill();
			this.ctx.restore();

			this.ctx.translate(-player[GameObject.Player.config.me].frame.x + this.ctx.canvas.width/2, -player[GameObject.Player.config.me].frame.y + this.ctx.canvas.height/2);

			this.ctx.save();
				this.ctx.rect(player[GameObject.Player.config.me].frame.x - this.ctx.canvas.width/2, player[GameObject.Player.config.me].frame.y - this.ctx.canvas.height/2, this.ctx.canvas.width, this.ctx.canvas.height);		
				this.ctx.fillStyle = pattern;
				this.ctx.fill();

				//this.ctx.beginPath();
			this.ctx.restore();


			this.ctx.beginPath();
			for (var key in ServeurItems) {
				if(
					ServeurItems[key].deleted || 
					GameObject.Player.notVisible(ServeurItems[key].x,ServeurItems[key].y)) { continue; }
				this.ctx.save();
					this.ctx.translate(ServeurItems[key].x,ServeurItems[key].y);
					this.ctx.rotate((ServeurItems[key].orientation-180)*Math.PI/180);
                    this.ctx.drawImage(imagesLoaded['latest1'].image, -24, -6);
				this.ctx.restore();
			}
			this.ctx.beginPath();

			// Ship
			for (var key in player) {
				if (GameObject.Player.isActive(key) || GameObject.Player.notVisible(player[key].frame.x, player[key].frame.y)) { continue; }

				this.ctx.save();
					this.ctx.translate(player[key].frame.x,player[key].frame.y);

					this.ctx.strokeStyle = "white";
					//this.ctx.strokeText(key+" "+(player[key].frame.x == undefined ? 0 : player[key].frame.x.toFixed(2))+"x "+(player[key].frame.y == undefined ? 0 :player[key].frame.y.toFixed(2))+"y", 40, -40);
					//this.ctx.strokeText(player[key].pseudo, 30, -30);
            
                    if (VisualObject.config.debug) {
                        this.ctx.strokeText((player[key].mouse.orientation * 1 + 0).toFixed(4) + " deg | vitesse: " + player[key].vitesse.toFixed(4) + " orientation: " + ((player[key].orientation + 0).toFixed(4)) + " deg", 40, -45);
                    }
					
					this.ctx.rotate((player[key].mouse.orientation-180)*Math.PI/180);

					this.ctx.save();
					if (player[key].demage) {
						this.ctx.beginPath();
						this.ctx.arc(0,0,30,0,2*Math.PI);
						this.ctx.shadowColor = player[key].stats.mana < 10 ? 'red' : '#039CAE';
						this.ctx.shadowBlur = 20;
						this.ctx.shadowOffsetX = 0;
						this.ctx.shadowOffsetY = 0;
						this.ctx.fill();
						this.ctx.stroke();

						player[key].demage = false;
					}
					this.ctx.restore();

					this.ctx.drawImage(
						imagesLoaded['ShipImage'].image, 
						-imagesLoaded['ShipImage'].image.width/7,
						-imagesLoaded['ShipImage'].image.height/7, 
						imagesLoaded['ShipImage'].image.width/3.5, 
						imagesLoaded['ShipImage'].image.height/3.5
					);

					this.ctx.beginPath();
					this.ctx.fillStyle = "rgba(68, 35, 56, "+(player[key].stats.mana/200)+")";
					this.ctx.arc(0,0,30,0,2*Math.PI);
					this.ctx.fill();

					this.ctx.beginPath();
					this.ctx.rotate(90*Math.PI/120);
					this.ctx.strokeStyle = "rgba(234, 234, 0, "+(player[key].vitesse/15)+")";
					this.ctx.arc(0,0,30,0,0.5*Math.PI);
					this.ctx.stroke();

				this.ctx.restore();	
			}

			for (var key in GameObject.MapServeur) {
				if  (!GameObject.Player.notVisible(GameObject.MapServeur[key].x, GameObject.MapServeur[key].y)) {
					this.ctx.save();
						this.ctx.translate(
							GameObject.MapServeur[key].x,
							GameObject.MapServeur[key].y
							);
						var nWidth = (imagesLoaded[GameObject.MapServeur[key].imageName].image.width)/2;
						var nHeight = (imagesLoaded[GameObject.MapServeur[key].imageName].image.height)/2;
						this.ctx.drawImage(
							imagesLoaded[GameObject.MapServeur[key].imageName].image, 
							-nWidth,
							-nHeight, 
							imagesLoaded[GameObject.MapServeur[key].imageName].image.width, imagesLoaded[GameObject.MapServeur[key].imageName].image.height
						);

						if (VisualObject.config.debug) {
							this.ctx.save();
							var plan = imagesMapping[GameObject.MapServeur[key].imageName];
							this.ctx.fillStyle = "#00FFFF";
							this.ctx.translate(-(imagesLoaded[GameObject.MapServeur[key].imageName].image.width)/2,
							-(imagesLoaded[GameObject.MapServeur[key].imageName].image.height)/2);
							this.ctx.globalAlpha = 0.5;
							for (var keyPx in plan) {
								this.ctx.fillRect(plan[keyPx].x-5,plan[keyPx].y-5,10,10);
								this.ctx.beginPath();
								this.ctx.stroke();
							}

							this.ctx.restore();
						}

						this.ctx.strokeStyle = "#009999";
						if (imagesMapping[GameObject.MapServeur[key].imageName]) {
								this.ctx.strokeText('Mapped', nWidth, -nHeight+20);
							};
						this.ctx.font = 'italic 25pt Calibri';
						this.ctx.strokeText(GameObject.MapServeur[key].name, nWidth, -nHeight);
					this.ctx.restore();
				}
			}

			// Plannette.
			// Aura autour de la planete.
			if (!GameObject.Player.notVisible(500,600)) {
				this.ctx.save(); 
					var grd = this.ctx.createRadialGradient(
						500,
						600,
						180,
						500,
						600,
						ColorPlannet
					);
					grd.addColorStop(0,"rgba(0,0,0,0)");
					grd.addColorStop(1,"rgba(239, 159, 146, 0.5)");
					
					this.ctx.arc(500,600,PlannetSize,0,2*Math.PI);
					this.ctx.fillStyle = grd;
					this.ctx.fill();
					this.ctx.beginPath();
				this.ctx.restore();
			
				

				this.ctx.save();

					this.ctx.translate(500,600);
					this.ctx.rotate(degrees*Math.PI/180);
					this.ctx.drawImage(
						imagesLoaded['WorldImage'].image, 
						-(imagesLoaded['WorldImage'].image.width-100)/2,
						-(imagesLoaded['WorldImage'].image.height-100)/2, 
						imagesLoaded['WorldImage'].image.width-100, imagesLoaded['WorldImage'].image.height-100
					);
					
					this.ctx.rotate(-degrees*Math.PI/180);
					this.ctx.translate(-500,600);
				this.ctx.restore();

				// Lunne
				/*this.ctx.save();
					
					this.ctx.translate(500,600);
					this.ctx.rotate((degrees/2)*Math.PI/180);
					sizeLune = 100;
					this.ctx.drawImage(
						LuneImage, 
						sizeLune + 75,
						sizeLune + 75, 
						sizeLune, sizeLune
					);

				this.ctx.restore();*/
			}

		this.ctx.restore();
		

		// FPS Show
		this.ctx.save();
			this.ctx.translate(canvasWidth - 100,  canvasHeight - 120);
			this.ctx.strokeStyle = "white";
			this.ctx.strokeText(fpsIps + " FPS", 0, 20);
			this.ctx.strokeText(fpsMs + " MS Frame", 0, 35);
			this.ctx.strokeText(MotorfpsIps + " Motor frame", 0, 50);
			this.ctx.strokeText(MotorfpsMs + " Motor ms", 0, 65);
			this.ctx.beginPath();
		this.ctx.restore();

		// Mouse
		this.ctx.save();
			
			this.ctx.translate(
				player[GameObject.Player.config.me].mouse.original.x,
				player[GameObject.Player.config.me].mouse.original.y
				);

			this.ctx.strokeStyle = "white";
			/*this.ctx.strokeText(
				player[GameObject.Player.config.me].mouse.x.toFixed(2)+"x "+player[GameObject.Player.config.me].mouse.y.toFixed(2)+"y", 
				10, 
				-20
				);*/

			this.ctx.arc(0,0,10,0,2*Math.PI, true);

			this.ctx.moveTo(-15, 0);
			this.ctx.lineTo(15, 0);
			this.ctx.moveTo(0, -15);
			this.ctx.lineTo(0, 15);
			this.ctx.stroke();
			this.ctx.beginPath();

		this.ctx.restore();
		
        this.showTargets(this.ctx);

    },

    showTargets : function (ctx)
    {
        for (var key in GameObject.MapServeur) {
            this.addElementToCercle(ctx, GameObject.MapServeur[key].x, GameObject.MapServeur[key].y, 'rgba(242, 156, 0, 0.5)', GameObject.MapServeur[key].name);
        }
        for (var key in player) {
            if (GameObject.Player.isActive(key)) { continue; }
            this.addElementToCercle(ctx, player[key].x, player[key].y, 'red', player[key].pseudo);
        }
        this.addElementToCercle(ctx, 90000, 90000, 'rgba(0, 175, 203, 0.74)', 'Faction 1', true);
        this.addElementToCercle(ctx, 90000, -90000, 'rgba(0, 175, 203, 0.74)', 'Faction 2', true);
        this.addElementToCercle(ctx, -90000, -90000, 'rgba(0, 175, 203, 0.74)', 'Faction 3', true);
        this.addElementToCercle(ctx, -90000, 90000, 'rgba(0, 175, 203, 0.74)', 'Faction 4', true);
        
        this.addElementToCercle(ctx, -70000, 50000, 'rgba(4, 176, 25, 0.88)', 'Quete exemple', true);
        
        ctx.save();
            ctx.beginPath();
            ctx.arc(canvasWidth / 2, canvasHeight / 2, (canvasHeight / 2) - 150, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 175, 203, 0.2)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(canvasWidth / 2, canvasHeight / 2, (canvasHeight / 2) - 200, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 175, 203, 0.2)';
            ctx.stroke();

            ctx.beginPath();
            var lifeDeg = (player[GameObject.Player.config.me].stats.life * 90 / 100);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, (canvasHeight / 2) - 202, 90*Math.PI/180, (90+ (lifeDeg > 0 ? lifeDeg : 0)) * Math.PI / 180, false);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(203, 0, 0, 0.5)';
            ctx.stroke();
        
            ctx.beginPath();
            manaDeg = (player[GameObject.Player.config.me].stats.mana * 90 / 100);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, (canvasHeight / 2) - 202, 180 * Math.PI / 180, (180+(manaDeg > 0 ? manaDeg : 0)) * Math.PI / 180, false);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(0, 175, 203, 0.5)';
            ctx.stroke();
        ctx.restore();
    },

    addElementToCercle : function (ctx, x, y, color, name, nolimit) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(
            canvasWidth / 2, canvasHeight / 2
        );
        
        var OrientationLine = GameObject.Math.getAngleByPositions(
            canvasWidth / 2, 
                canvasHeight / 2,
                x - player[GameObject.Player.config.me].x + (canvasWidth / 2),
                y - player[GameObject.Player.config.me].y + (canvasHeight / 2)
        );
        
        var DistanceLine = GameObject.Math.getDistanceElements(
            canvasWidth / 2, 
                canvasHeight / 2,
                x - player[GameObject.Player.config.me].x + (canvasWidth / 2),
                y - player[GameObject.Player.config.me].y + (canvasHeight / 2)
        );
        
        if (DistanceLine > (canvasHeight / 2)-200 && (DistanceLine < 3000 || nolimit != undefined)) {
            ctx.rotate(OrientationLine * Math.PI / 180);
            ctx.moveTo(-(canvasHeight / 2) + 200 - (nolimit != undefined ? 50 : 0), 0);
            ctx.lineTo(-(canvasHeight / 2) + 150 - (nolimit != undefined ? 100 : 0), 0);
            ctx.save();
            ctx.translate(-(canvasHeight / 2) + 115 -(nolimit != undefined ? 100 : 0) , 0);
            ctx.rotate(-OrientationLine * Math.PI / 180);
            ctx.font = 'italic 10pt Calibri';
            ctx.textAlign = 'center';
            ctx.fillStyle = color;
            ctx.fillText(DistanceLine.toFixed(0) + 'm', 0, 5);
            ctx.fillText(name, 0, -5);
            //ctx.globalAlpha = 0.5;
            ctx.restore();
            //ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.globalAlpha = DistanceLine < 1100 ? 0.9 : 0.2;
        }
        
    
            
        ctx.stroke();
        ctx.restore();
    }
};
