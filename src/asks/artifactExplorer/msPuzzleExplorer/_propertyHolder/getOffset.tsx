if(links.gameBoard){
    return {
        x: Math.round((links.gameBoard.tags.homeX - 0.5)*100)/100,
        y: Math.round((links.gameBoard.tags.homeY - 0.5)*100)/100
    }
}
else {
    console.error("Game board not found. Unable to find offset.")
}