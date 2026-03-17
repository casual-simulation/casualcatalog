os.unregisterApp("landmarkInfoApp");
os.registerApp("landmarkInfoApp", thisBot);

let journal = getBot(byTag("artifactJournal", true));
journal.tags.currentRegisteredApp = "landmarkInfoApp";

const landmark = getBot("landmarkID", that);
tags.itemName = landmark.tags.landmarkName;
tags.itemInfo = landmark.tags.landmarkDesc;
tags.imageSrc = landmark.tags.landmarkImg;
tags.itemLink = landmark.tags.landmarkLink;

const App = thisBot.getApp();

os.compileApp("landmarkInfoApp", <App />)