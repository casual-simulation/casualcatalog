const playerCheck = that.tags.playerTile && that.tags.playerTile == true ? true : false;

if(playerCheck){
    const playerX = that.tags.homeX;
    const playerY = that.tags.homeY;
    const thisX = tags.homeX;
    const thisY = tags.homeY;

    const dirX = thisX - playerX;
    const dirY = thisY - playerY;

    if(dirX == 0 && dirY == 1){
        thisBot.move("up");
    }
    else if(dirX == 0 && dirY == -1){
        thisBot.move("down");
    }
    else if(dirX == 1 && dirY == 0){
        thisBot.move("right");
    }
    else if(dirX == -1 && dirY == 0){
        thisBot.move("left");
    }
}