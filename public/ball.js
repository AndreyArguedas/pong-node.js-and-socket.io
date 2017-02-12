function Ball(x,y,xv,yv,r){
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.r = r;
  this.show = function(){
    ellipse(this.x,this.y,this.r,this.r);
  }

  this.move = function(){
    if(this.y < 1)
      this.yv = 5;
    if(this.y >= height)
      this.yv = -5;
    this.y += this.yv;
    this.x += this.xv;
  }

  this.collision = function(p){
      var d = dist(this.x,this.y,p.x,p.y);
      var r = floor(random(2));
      if(d < this.r + 20){
        if(r === 1)
            if(this.y-p.y < 0)
              this.yv = 5;
            else if(this.y - p.y == 0)
              this.yv = 0;
            else
              this.yv = -5;
        return true;
      }
      else
        return false;
    }
}
