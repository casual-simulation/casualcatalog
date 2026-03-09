//"that" should be the landmark's [Name, Latitude, Longitude, Description, imageSrc, videoSrc, Interactive]
//If they have some of them, make sure to send in null for that category
//Right now, "Interactive" is just the link to be opened in a new tab (Like, if you want to be able to open the video in a new tab, you can send the videoSrc in for Interactive, too)

masks.landmarkName = that[0];
masks.landmarkLat = that[1];
masks.landmarkLong = that[2];
masks.landmarkInfo = that[3];

masks.imageSrc = that[4];
masks.videoSrc = that[5];
masks.landmarkInteractive = that[6];

whisper(getBot(byTag("name", "hudBot")), "closeApp");
whisper(getBot(byTag("name", "collection1")), "closeApp");
whisper(getBot(byTag("name", "collectionsMenu")), "closeApp");
whisper(getBot(byTag("name", "help")), "closeApp");
whisper(getBot(byTag("name", "info")), "closeApp");
thisBot.openApp();