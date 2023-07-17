//Rendering stuff
const screenWidth = 640;
const screenHeight = 480;
  
const frameDelay = 1000/60;

const maxSpeed = 25;

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

//Image
const dvd = new Image();
dvd.src = "images/dvd.png"

//Sound
const bump = new Audio();
bump.src = "sounds/bump.wav";

//Movement Variables
var x = 0;
var y = 0;
var vx = 0;
var vy = 0;

//Starting the canvas
canvas.setAttribute("width", screenWidth);
canvas.setAttribute("height", screenHeight);
document.body.appendChild(canvas);
setInterval(Update,frameDelay)

//Starts moving the meme
function Start()
{
  vx = 1;
  vy = 1;
}

//Stops the meme from moving
function Stop()
{
  vx = 0;
  vy = 0;
}

//Updates every frame so the meme moves
function Update()
{
  //Adding velocity to position
  x += vx;
  y += vy;

  //if the meme hits left or right edge, invert velocity
  if(x >= (screenWidth - 50) || x <= 0)
  {
    vx = -vx * 1.25;
    if(vx > maxSpeed)
    {
      vx = maxSpeed;
    }
    if(vx < -maxSpeed)
    {
      vx = -maxSpeed;
    }
    bump.play();
  }

  //if the meme hits top or bottom, invert velocity
  if(y >= (screenHeight - 50) || y <= 0)
  {
    vy = -vy * 1.25;
    if(vy > maxSpeed)
    {
      vy = maxSpeed;
    }
    if(vy < -maxSpeed)
    {
      vy = -maxSpeed;
    }
    bump.play();
  }

  //clear the screen
  context.fillStyle = "grey";
  context.fillRect(0,0,screenWidth,screenHeight);

  //render the meme
  context.drawImage(dvd,x,y,50,50);
}