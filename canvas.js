console.log('hello')
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height= window.innerHeight
console.log(canvas)

/* c = context */
var c = canvas.getContext('2d');
/* Return a drawing context of 2d(super object) to draw in the object */

// Change color of rect. Can use rgba();
c.fillStyle = "rgba(0, 255, 0 , 0.5)"
c.fillRect(200,100,15,15);
// Line
c.beginPath(150,100)
c.moveTo(300, 500)
c.lineTo(300, 400)
c.lineTo(400,25)
c.strokeStyle = "#aaa"
c.stroke()

//Arcs/ Circle
//Stops current path. and creates a new path
c.beginPath()
c.arc(450, 300, 30 ,0, Math.PI *2, false)
c.stroke()

createSquare = (x,y) =>{
  console.log(x,y)
  c.fillStyle = "FFF"
  c.fillRect(x,y,15,15)
}
// Random Squares
for (var i =0 ; i < 24 ; i++){
  var x = Math.random()*window.innerWidth
  var y = Math.random() * window.innerHeight
  c.fillStyle = "#FF0000"
  c.fillRect(x,y,15,15)
}
function Square(x,y,dx,dy){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;

  this.draw = function() {
    console.log('hi')
    c.fillStyle = "FFF"
    c.fillRect(x,y,15,15)
  }

  this.update = function() {
    if(this.x > innerWidth || this.x < 0){
      this.dx = -this.dy
    }
    if(this.y > innerHeight || this.y < 0){
      this.dy = -this.dy
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw()
  }
}

var square = Square(150,600, 3,4)
square.draw()
//Forever loop where animation calls itself
function animate() {
  requestAnimationFrame(animate);

}
animate()
