let xCoord = Math.round(that.to.x * 100)/100;
let yCoord = Math.round(that.to.y * 100)/100;

let currX = tags.homeX;
let currY = tags.homeY;

let up = xCoord == currX && yCoord == currY+1;
let down = xCoord == currX && yCoord == currY-1;
let left = yCoord == currY && xCoord == currX-1;
let right = yCoord == currY && xCoord == currX+1;

if(up){
    thisBot.onKeyDown({ keys: ["w"] })
    // thisBot.move("up");
}
if(down){
    thisBot.onKeyDown({ keys: ["s"] })
    // thisBot.move("down");
}
if(left){
    thisBot.onKeyDown({ keys: ["a"] })
    // thisBot.move("left");
}
if(right){
    thisBot.onKeyDown({ keys: ["d"] })
    // thisBot.move("right");
}