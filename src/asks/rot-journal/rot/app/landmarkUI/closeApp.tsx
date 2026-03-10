masks.landmarkName = null;
masks.landmarkLat = null;
masks.landmarkLong = null;
masks.imageSrc = null;
masks.videoSrc = null;
masks.landmarkInfo = null;
masks.landmarkInteractive = null;

os.unregisterApp("landmarkApp");

if (that == "x"){
    let hudBot = getBot(byTag("name", "hudBot"));
    hudBot.openApp();
}