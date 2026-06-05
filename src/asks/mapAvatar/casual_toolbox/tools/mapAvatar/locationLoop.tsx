// begins the loop of location updating
if(!links.homeworld?.tags.usingGPS){
    return;
}

await os.sleep(500)
console.log("[RoT] updating location")
whisper(thisBot, "updateLocation")