var MotorRotateByFrame = 0;

var fpsFilter = 1; // the low pass filter to apply to the FPS average, 1 = none
var fpsDesired = 40; // your desired FPS, also works as a max

/* don't touch these ;) */
var fpsAverage = fpsDesired;
var timeCurrent, timeLast = Date.now();
var drawing = false;

var MotoFilter = 1; // the low pass filter to apply to the Moto average, 1 = none
var MotoDesired = 40; 
var MotorfpsAverage = MotoDesired;

var MotortimeCurrent, MotortimeLast = Date.now();
var Motordrawing = false;

var fpsMs = 0;
var fpsIps = 0;

var MotorfpsMs = 0;
var MotorfpsIps = 0;

function MotorfpsUpdate() {
  	MotorfpsIps = MotorfpsAverage.toFixed(2);
}

function fpsUpdate() {
    fpsIps = fpsAverage.toFixed(2);

}

/* the main draw function */
function MotorDraw() {
    /* Block in case of long draw */
    if(Motordrawing) { return; } else { Motordrawing = true; }
    
    /* Record the start time for draw time measurements */
    var timeStart = Date.now();

    /* execute Motordrawing code. sample code inserted */

    if (GameObject.Player.config.me) {
	    GameObject.drawEngine();
	}
    // VisualObject.drawMap();

    MotortimeCurrent = Date.now();
    var fpsThisFrame = 1000 / (MotortimeCurrent - MotortimeLast);
    if (MotortimeCurrent > MotortimeLast) {
        MotorfpsAverage += (fpsThisFrame - MotorfpsAverage) / MotoFilter;
        MotortimeLast = MotortimeCurrent;
    }

    Motordrawing = false;
    
    /* To test how long Motordrawing takes for the demo */
    MotorfpsMs = Date.now() - timeStart;
    //document.getElementById('msOutput').innerHTML = ;
}

/* set the fps update interval */
setInterval(MotorfpsUpdate, 1000);

/* call the first update so we don't start on 0.00 */
MotorfpsUpdate();

/* call drawFrame() for testing, this will probably
   go inside your main() loop */
setInterval(MotorDraw, 1000 / fpsDesired);

/* The first run, before the interval triggers */
MotorDraw();

/* the main draw function */
function frameDraw() {
    /* Block in case of long draw */
    if(drawing) { return; } else { drawing = true; }
    
    /* Record the start time for draw time measurements */
    var timeStart = Date.now();

    /* execute drawing code. sample code inserted */
    if (GameObject.Player.config.me) {
	    VisualObject.draw();
	}
    // VisualObject.drawMap();

    timeCurrent = Date.now();
    var fpsThisFrame = 1000 / (timeCurrent - timeLast);
    if (timeCurrent > timeLast) {
        fpsAverage += (fpsThisFrame - fpsAverage) / fpsFilter;
        timeLast = timeCurrent;
    }

    drawing = false;
    
    /* To test how long drawing takes for the demo */
    fpsMs = Date.now() - timeStart;
    //document.getElementById('msOutput').innerHTML = ;
}

/* set the fps update interval */
setInterval(fpsUpdate, 1000);

/* call the first update so we don't start on 0.00 */
fpsUpdate();

/* call drawFrame() for testing, this will probably
   go inside your main() loop */
setInterval(frameDraw, 1000 / fpsDesired);

/* The first run, before the interval triggers */
frameDraw();

