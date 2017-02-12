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

//b = new Ball(0,0,0,0,0,0);

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

setInterval(heartbeat,30);


function heartbeat(){
	io.sockets.emit('heartbeat',players);
}

setInterval(heartbeatBall,30);


function heartbeatBall(){
	//if(connections.length === 2)
		io.sockets.emit('heartbeatBall',b);
}

/*function needBall(){
	if(balls.length > 0){
		b = balls.pop()
		io.sockets.emit('needBall',b);
		console.log(b);
	}
	else
		io.sockets.emit('needBall',"finished");
}*/


io.sockets.on('connection',function(socket){
	connections.push(socket);
	getCounter();
	socket.on('start',function(data){
		var p = new Player(socket.id,data.x,data.y,data.w,data.h,data.p);
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

	}); 

	socket.on('updateBall',function(data){
		b.x = data.x;
		b.y = data.y;
		b.xv = data.xv;
		b.yv = data.yv;
		b.r = data.r;
	}); 

});//when someone connects

/*
	Gente pura vida. Estoy desarrollando un juego con node.js y socket.io, y tengo implementado que solo hayan 2 clientes por partida ya que el juego es 1 vs 1. Pero quisiera lograr que si otros 2 clientes se conectaran para ellos se maneje otra partida totalmente aparte, sin embargo no he podido encontrar algo similar o que se ajuste a esto que intento. Si alguien me pudiese dar una pequeña guía lo agradezco :)
*/