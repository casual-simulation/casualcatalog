// begins the loop of location updating
if(!tags.continueLocationPull){
    return;
}

await os.sleep(tags.locationFetchInterval)
console.log("[RoT] updating location")
whisper(thisBot, "updateLocation")