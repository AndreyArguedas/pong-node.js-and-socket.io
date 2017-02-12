var players = [];
//var balls = [];
var connections = [];
var b;
function Player(id,x,y,v,w,h,p){
   this.id = id;
   this.x = x;
   this.y = y;
   this.w = w;
   this.h = h;
   this.points = p;
}

function Ball(id,x,y,xv,yv,r){
  this.id = id;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.r = r;
}


var express = require('express'); //Import the module
var app = express(); //Now we have an express app
var server = app.listen(3000);
app.use(express.static('public')); //host everything in the public directory
console.log("Running");
var socket = require('socket.io'); //Same as express
var io = socket(server); //this var handles input and output through the socket pointing the server


function getCounter(){
	io.sockets.emit('getCounter',connections.length);
	console.log(connections.length);
}

setInterval(heartbeat,33);


function heartbeat(){
	io.sockets.emit('heartbeat',players);
}

setInterval(heartbeatBall,33);


function heartbeatBall(){
	io.sockets.emit('heartbeatBall',b);
}


io.sockets.on('connection',function(socket){
	connections.push(socket);
	getCounter();
	socket.on('start',function(data){
		var p = new Player(socket.id,data.x,data.y,data.w,data.h,data.points);
		players.push(p);
	}); 

	socket.on('startBall',function(data){
		b = new Ball(socket.id,data.x,data.y,data.xv,data.yv,data.r);
	}); 

	socket.on('disconnect',function(data){
		connections.splice(connections.indexOf(socket),1);
		console.log("disconnected");
	});

	socket.on('update',function(data){
		var wich;
		for(var i = 0; i < players.length; i++){
			if(socket.id === players[i].id)
				wich = players[i];
		}
		wich.x = data.x;
		wich.y = data.y;
		wich.v = data.v;
		wich.w = data.w;
		wich.h = data.h;
		wich.points = data.points;
	}); 

	socket.on('updateBall',function(data){
		b.x = data.x;
		b.y = data.y;
		b.xv = data.xv;
		b.yv = data.yv;
		b.r = data.r;
	}); 

});
