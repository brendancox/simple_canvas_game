var Game = {
	fps: 50,
	controls: {up: 0, down: 0, left: 0, right: 0},
	ctx: document.getElementById("gameCanvas").getContext("2d"),
	run: function run(){
		player.update();
		drawBoard();
	}
}

Game.intervalId = setInterval(Game.run, 1000 / Game.fps);

function drawBoard(){
	Game.ctx.clearRect(0, 0,400,400);
	Game.ctx.moveTo(0, 0);
	Game.ctx.fillStyle = 'black';
	Game.ctx.fillRect(0,0,400,400);
	player.draw();
	NPC.draw();
	for (i = 0; i < blocks.length; i++){
		blocks[i].draw();
	}
}

// controls
window.onkeydown = function(e){
	player.hasTarget = false;
	if (e.keyCode == 37){ //left
		Game.controls.left = 1;
	}
	if (e.keyCode == 38){ //up
		Game.controls.up = 1;
	}
	if (e.keyCode == 39){ //right
		Game.controls.right = 1;
	}
	if (e.keyCode == 40){ //down
		Game.controls.down = 1;
	}
};
window.onkeyup = function(e){
	if (e.keyCode == 37){ //left
		Game.controls.left = 0;
	}
	if (e.keyCode == 38){ //up
		Game.controls.up = 0;
	}
	if (e.keyCode == 39){ //right
		Game.controls.right = 0;
	}
	if (e.keyCode == 40){ //down
		Game.controls.down = 0;
	}
};

Game.ctx.canvas.onmousedown = function(e){
	player.hasTarget = true;
	player.target.y = e.clientX;
	player.target.x = e.clientY;
	player.target.angle = Math.atan2(player.x - player.target.x, player.y - player.target.y);
	player.target.xMove = Math.sin(player.target.angle);
	player.target.yMove = Math.cos(player.target.angle);	
};

function Character(x,y,color){
	this.x = x;
	this.y = y;
	this.color = color;
	this.size = 30;
	this.radius = this.size / 2;
	this.draw = function(){
		Game.ctx.fillStyle = this.color;
		Game.ctx.beginPath();
		Game.ctx.arc(this.y, this.x, this.radius, 0, 2*Math.PI);
		Game.ctx.fill();
	};
	this.hasTarget = false;
	this.target = {x: 0, y: 0, angle: 0, xMove: 0, yMove: 0, accuracy: 2};
	this.approachTarget = function(){
		var variance  = this.target.accuracy;
		if ((this.x < (this.target.x + variance)) && (this.x > (this.target.x - variance)) && 
			(this.y < (this.target.y + variance)) && (this.y > (this.target.y - variance))){
				this.hasTarget = false;
		}
		else {
			this.x -= this.target.xMove;
			this.y -= this.target.yMove;
		}
	}
	this.distanceBetween = function(thisX, thisY, otherX, otherY){
		return Math.sqrt(Math.pow(thisX - otherX, 2) + Math.pow(thisY - otherY, 2));
	}
}

var player = new Character(100,100,'red');
player.checkCollisions = function(newX, newY){
	for(i = 0; i < collidables.length; i++){
		if (this.distanceBetween(newX, newY, collidables[i].x, collidables[i].y) < (this.radius + collidables[i].radius + 2)){
			return true;
		}
	}
}
player.update = function(){
	if (this.hasTarget == false){
		if (!this.checkCollisions(this.x + Game.controls.down, this.y)){ this.x += Game.controls.down};
		if (!this.checkCollisions(this.x - Game.controls.up, this.y)){ this.x -= Game.controls.up};
		if (!this.checkCollisions(this.x, this.y + Game.controls.right)){ this.y += Game.controls.right };
		if (!this.checkCollisions(this.x, this.y - Game.controls.left)){ this.y -= Game.controls.left };
	}
	else {
		prevX = this.x;
		prevY = this.y;
		this.approachTarget();
		if (this.checkCollisions(this.x, this.y)){
			this.x = prevX;
			this.y = prevY;
		}
	}
}


var NPC = new Character(200, 200, 'blue');

function Block(x, y, color){
	this.x = x;
	this.y = y;
	this.color = color;
	this.size = 10;
	this.radius = this.size / 2;
	this.draw = function(){
		Game.ctx.fillStyle = this.color;
		Game.ctx.fillRect(this.x - this.radius, this.y - this.radius,this.size,this.size);
	};
}

// walls
blocks = [];
for (i = 0; i < 40; i++){
	blocks[4*i] = new Block(i*10 + 5, 5, 'grey');
	blocks[4*i+1] = new Block(i*10 + 5, 395, 'grey');
	blocks[4*i+2] = new Block(5, i*10 + 5, 'grey');
	blocks[4*i+3] = new Block(395, i*10 + 5, 'grey');
}

collidables = [NPC];
collidables.push.apply(collidables, blocks);