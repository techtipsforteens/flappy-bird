function helloWorld() {
	console.log("Hello World!");
}

var hversion = document.getElementById("version").innerHTML

var cversion = getComputedStyle(document.documentElement).getPropertyValue('--version');

var jversion = "1";

async function checkVersion() {
  console.log(hversion);
  console.log(jversion);
  console.log(cversion);
  if (hversion != cversion) {
    console.log("Clear cache.");
    window.location.reload(true);
  } else if (hversion != jversion) {
    console.log("Clear cache.");
    window.location.reload(true);
  } else {
    console.log("All good.");
  }
}

// Canvas Variables
var grid = document.getElementById("grid");
var ctx = grid.getContext("2d");
var width = grid.width;
var height = grid.height;
var type = [19, 19];

function drawGrid() {
	/*for (i=0; i<(type[0] + 1); i++) {
		var cornerx = ((width/type[0])*i)
		for (j=0; j<(type[1] + 1); j++) {
			var cornery = ((height/type[1])*j)
			// Left
			ctx.moveTo(cornerx, cornery);
			ctx.lineTo(cornerx, (height/type[1]));
			ctx.stroke();
			// Right
			ctx.moveTo((width/type[0]), cornery);
			ctx.lineTo((width/type[0]), (height/type[1]));
			ctx.stroke();
			// Top
			ctx.moveTo(cornerx, cornery);
			ctx.lineTo((width/type[0]), cornery);
			ctx.stroke();
			// Bottom
			ctx.moveTo(cornerx, (height/type[1]));
			ctx.lineTo((width/type[0]), (height/type[1]));
			ctx.stroke();
		}
	}*/
	
	cellw = (width/type[0]);
	cellh = (height/type[1]);
	
	// Horizontal
	for (i=0; i<(type[1] + 1); i++) {
		ctx.moveTo(0, (cellh*i));
		ctx.lineTo(width, (cellh*i));
		ctx.stroke();
	}
	// Verticle
	for (i=0; i<(type[0] + 1); i++) {
		ctx.moveTo((cellw*i), 0);
		ctx.lineTo((cellw*i), height);
		ctx.stroke();
	}
}

function fillCell(x, y, w, h, c) {
	//console.log("x: " + x + " y: " + y + " w: " + w + " h: " + h + " c: " + c);

	var cellw = (width/type[0]);
	var cellh = (height/type[1]);
	ctx.beginPath();
	/*if (x > type[0]) {
		document.getElementById("error").innerHTML = "Whoops! Invalid Coordinate!";
		return;
	}
	if (y > type[1]) {
		document.getElementById("error").innerHTML = "Whoops! Invalid Coordinate!";
		return;
	}*/
	var startx = (cellw*x);
	var starty = (cellh*y);
	var fw = (cellw*w);
	var fh = (cellh*h);
	if (c == false) {
		ctx.clearRect(startx, starty, fw, fh);
	} else {
		ctx.rect(startx, starty, fw, fh);
		ctx.fillStyle = c;
		ctx.fill();
	}
}

function drawImageToCell(image, x, y, w, h) {
	var cellw = (width/type[0]);
	var cellh = (height/type[1]);
	var startx = (cellw*x);
	var starty = (cellh*y);
	ctx.beginPath();
	ctx.drawImage(image, startx, starty, cellw, cellh);
}

function drawTextToCell(x, y, t, f="60px Arial", c="black", a="center") {
	var cellw = (width/type[0]);
	var cellh = (height/type[1]);
	var startx = (cellw * x);
	var starty = (cellh * y);
	ctx.beginPath();
	ctx.font = f;
	ctx.fillStyle = c;
	ctx.textAlign = a;
	ctx.fillText(t, startx, starty);
}

function calculateCorner(x, y) {
	return [(x - 0.5), (y - 0.5)];
}

class cords {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// FLAPPY BIRD
var score = 0;
var highscore = 0;
var start = false;
var space = false;
var alive = true;
var cury = 9.5;
const xpos = 4;
const pipewidth = 3;
const gheight = 4;
const flyspace = 5;
const pipecolor = "green";
var gravity = 12;
var ignorespace = false;
const spacebarforce = -8;
const blue = "#ADD8E6";
var timeaftersb = 0;
var velocity = 0;
var pipes = [];
var score = 0;
var pipespeed = 2;
var pipecounter = 0;
var flapcounter = 0;
const fps = 60;

//sounds


//htmlscore
var htmlscore = document.getElementById("score");

function drawMap() {
	fillCell(0, 0, type[0], type[1], blue);
	fillCell(0, (type[1] - gheight), type[0], type[1], "brown");
}

function drawFlappyBird(x, y) {
	if (flapcounter <= (0.5 * fps)) {
		drawImageToCell(document.getElementById("flappybird"), x, y, 1, 1);
		flapcounter++;
	} else if (flapcounter >= fps) {
		drawImageToCell(document.getElementById("flappybirdwingdown"), x, y, 1, 1);
		flapcounter = 0;
	} else {
		drawImageToCell(document.getElementById("flappybirdwingdown"), x, y, 1, 1);
		flapcounter++;
	}
}

function drawPipes() {
	for (i=0; i<pipes.length; i++) {
		var halfw = (pipes[i].w / 2);
		var halffs = (pipes[i].pipefs / 2);

		//prev
		var cornx = (pipes[i].prev.x - halfw);
		//top
		var bottomt = (pipes[i].prev.y - halffs);
		fillCell(cornx, 0, pipes[i].w, bottomt, blue);
		//bottom
		var top = (pipes[i].prev.y + halffs);
		var hb = (type[1] - (bottomt + pipes[i].pipefs));
		fillCell(cornx, top, pipes[i].w, hb, blue);

		//cur
		var cornx = (pipes[i].cur.x - halfw);
		//top
		var bottomt = (pipes[i].cur.y - halffs);
		fillCell(cornx, 0, pipes[i].w, bottomt, pipes[i].c);
		//bottom
		var top = (pipes[i].cur.y + halffs);
		var hb = (type[1] - (bottomt + pipes[i].pipefs));
		fillCell(cornx, top, pipes[i].w, hb, pipes[i].c);
	}
	fillCell(0, (type[1] - gheight), type[0], type[1], "brown");
}

class pipe {
	constructor(y, pipefs=flyspace, buffer=0, w=pipewidth, c=pipecolor) {
		this.cur = new cords((type[0] + buffer), y);
		this.prev = new cords((type[0] + buffer), y);
		this.w = w;
		this.pipefs = pipefs;
		this.c = c;
		this.passed = false;
	}
	update(type, numb=pipespeed) {
		if (type == "cur") {
			this.cur.x -= (numb / fps);
		} else if (type == "prev") {
			this.prev.x -= (numb / fps);
		} else {
			throw "Type must be 'cur' or 'prev'.";
		}
	}
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function move() {
	var stop = false;

	if ((type[1] - cury) <= (gheight + 1)) {
		stop = true;
	}

	if (cury < 0.5) {
		gravity = 48;
		ignorespace = true;
	}

	if (stop == false) {
		fillCell(xpos, cury, 1, 1, blue);
		cury = calculateNextBirdPos();
		drawFlappyBird(xpos, cury);

		for (i=0; i<pipes.length; i++) {
			pipes[i].update("cur");
		}
		drawPipes();
		for (i=0; i<pipes.length; i++) {
			if ((xpos >= (pipes[i].cur.x - (0.5 * pipewidth))) && (xpos <= (pipes[i].cur.x + (0.5 * pipewidth)))) {
				if ((cury <= (pipes[i].cur.y - (0.5 * flyspace))) || (cury >= (pipes[i].cur.y + (0.5 * flyspace)))) {
					/*console.log("--- FRAME ---");
					console.log("CURY: ")
					console.log(cury);
					console.log("TOP: ");
					console.log(pipes[i].cur.y + (0.5 * flyspace));
					console.log("BOTTOM: ");
					console.log(pipes[i].cur.y - (0.5 * flyspace));
					console.log("--- FRAME ---");*/
					gravity = 48;
					ignorespace = true;
					return;
				}
			}
			pipes[i].update("prev");
			if ((pipes[i].cur.x + (pipewidth / 2)) < 0) {
				pipes.shift();
			}
			if ((pipes[i].cur.x + (pipewidth / 2)) < xpos) {
				if (pipes[i].passed == false) {
					pipes[i].passed = true;
					score++;
				}
			}
		}
		pipecounter += 1;
		if (pipecounter >= (3 * fps)) {
			pipes.push(new pipe(getRndInteger((type[1] / 4), ((type[1] / 4) * 2.5))));
			pipecounter = 0;
		}
		//console.log(pipes);
	} else {
		alive = false;
	}
}

function calculateNextBirdPos() {
	if (space == true) {
		//timeaftersb = (1);
		velocity = spacebarforce;
	} else {
		velocity += (gravity / fps);
		//timeaftersb += (1 / fps);
	}
	//console.log(velocity);
	return (velocity / fps) + cury;
	//return (((gravity / fps) * Math.pow(timeaftersb, 2)) + ((spacebarforce / fps) * timeaftersb) + cury);
}

document.onkeydown = checkKeyd;

function checkKeyd(e) {

    e = e || window.event;

    if ((e.keyCode == '32') || (e.keyCode == '38')) {
		handleSpaceBar("keydown");
    }
}

document.onkeyup = checkKeyu;

function checkKeyu(e) {

    e = e || window.event;

    if ((e.keyCode == '32') || (e.keyCode == '38')) {
		handleSpaceBar("keyup");
    }
}

document.ontouchstart = handleSpaceBar("keydown");

document.ontouchend = handleSpaceBar("keyup")

function handleSpaceBar(event) {
	if (ignorespace == true) {
		return "OOF";
	}
	if (event == "keydown") {
		if (start != true) {
			start = true;
		} else {
			space = true;
		}
	} else if (event == "keyup") {
		space = false;
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function go() {
	score = 0;
	start = false;
	space = false;
	alive = true;
	cury = 9.5;
	gravity = 12;
	ignorespace = false;
	timeaftersb = 0;
	velocity = 0;
	pipes = [];
	score = 0;
	pipespeed = 2;
	pipecounter = 0;
	flapcounter = 0;

	drawMap();

	pipes.push(new pipe(7));
	pipes[0].cur.x = 9.5;
	pipes[0].prev.x = 9.5;
	drawPipes();
	//var newcolor = "white";
	while (alive == true) {
		drawMap();
		move();
		drawTextToCell((type[0] - 1), 2, score);
		drawTextToCell((type[0] - 1), 3, highscore, "30px Arial");
		/*if (newcolor == "white") {
			newcolor = "red";
		} else {
			newcolor = "white"
		}
		fillCell(0, 0 , type[0], type[1], newcolor);*/
		await sleep(1000 / fps);
		//await sleep(100);
	}
	drawMap();
	var finalscore = ("Final Score: " + score);
	drawTextToCell((type[0] / 2), (type[1] / 2), finalscore);
	if (score > highscore) {
		highscore = score;
	}
	drawTextToCell((type[0] / 2), ((type[1] / 2) + 1.5), ("High Score: " + highscore), "40px Arial");
}