let keyPressed = that.keys[0]

switch(keyPressed){
    // allow the user to press "Shift+R" to retry location 
    case "R":
        tags.continueLocationPull = true
        whisper(thisBot, "locationLoop")
}