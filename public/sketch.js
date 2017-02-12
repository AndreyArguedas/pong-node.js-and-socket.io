var socket;
var p1;
var b;
var lastPos;
var go = false;
var players = [];
var counter = 0;
var bn = true;
function setup(){
    
    socket = io.connect('http://localhost:3000');
    createCanvas(400,400);
    b = new Ball(width/2,height/2,5,5,15);
    socket.on('getCounter',function(data){
      counter = data;
      print(counter);
      if(p1 === undefined){
      if(counter % 2 === 0 )
        p1 = new Player(0);
      else
        p1 = new Player(width);
      }
    var data = {
    x:p1.x,
    y:p1.y,
    v:p1.velocity,
    w:p1.w,
    h:p1.h,
    p:p1.points
  };
  socket.emit('start',data);

  var data = {
    x:b.x,
    y:b.y,
    xv:b.xv,
    yv:b.yv,
    r:b.r
  };
  socket.emit('startBall',data);
  
  if(counter === 2){
    /*socket.on('needBall',function(data){
      print(data);
      b = new Ball(data.x,data.y,data.xv,data.yv,data.r);
      bn = false;
    })*/
    go = true;
  }
  });
      

  socket.on('heartbeat',function(data){
    players = data;
  });

  socket.on('heartbeatBall',function(data){
    if(data !== null){
      b.x = data.x,
      b.y = data.y,
      b.xv = data.xv,
      b.yv = data.yv,
      b.r = data.r
  }
  });

}

function draw(){
    background(0);
    rect(width/2,0,10,600);
    if(go === true){
    for(var i = 0; i < players.length; i++){
      var id = players[i].id;
      if(id !== socket.id){
        fill(255,0,0);
        rectMode(CENTER);
        rect(players[i].x,players[i].y,players[i].w,players[i].h);
      }
    }
    p1.show();
    p1.move();
    //print(b);
    b.show();
    b.move();
    if(b.collision(p1) && p1.x === 0)
      b.xv = 5;
    if(b.collision(p1) && p1.x === width)
      b.xv = -5;
    if(b.x < 0){
      //throwBall();
      b.xv = 5;
    }
    if(b.x > width){
        //throwBall();
        b.xv = -5;
    }

    var data = {
    x:p1.x,
    y:p1.y,
    w:p1.w,
    h:p1.h
  };

  socket.emit('update',data);

  var data = {
    x:b.x,
    y:b.y,
    xv:b.xv,
    yv:b.yv,
    r:b.r
  };
  socket.emit('updateBall',data);
}}

/*function throwBall(){
    if(balls.length > 0)
      b = balls.pop();
    else {
      showWinner();
      alert("Do you want to play again?");
      window.location.reload();
    }
}

function showWinner(){
  background(0);
  textSize(80);
  fill(0, 102, 153);
  if(p1.points > p2.points)
    text("PLAYER1 WINS", width/2 - 100, height/2);
  else if(p2.points > p1.points)
    text("PLAYER2 WINS", width/2 - 100, height/2);
  else
    text("TIE", width/2 -100, height/2);

}*/

