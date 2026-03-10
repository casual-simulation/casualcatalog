// begins the loop of location updating
if(!tags.continueLocationPull){
    return;
}

await os.sleep(500)
console.log("[RoT] updating location")
whisper(thisBot, "updateLocation")