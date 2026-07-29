// begins the loop of location updating
if(!ab.links.navigation?.tags.usingGPS){
    return;
}

await os.sleep(500)
whisper(thisBot, "updateLocation")