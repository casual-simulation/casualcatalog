const positionUpdate = that.tags.includes("homeX") || that.tags.includes("homeY") ? true : false;

if(positionUpdate){
    links.controller.setPEBotPositions();
}