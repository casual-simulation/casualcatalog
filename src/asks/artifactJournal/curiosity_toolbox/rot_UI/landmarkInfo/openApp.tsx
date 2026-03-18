let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "landmarkInfoApp");

journal.tags.currentRegisteredApp = "landmarkInfoApp";
os.registerApp("landmarkInfoApp", thisBot);

const landmark = getBot("landmarkID", that);
tags.itemName = landmark.tags.landmarkName;
tags.itemInfo = landmark.tags.landmarkDesc;
tags.imageSrc = landmark.tags.landmarkImg;
tags.itemLink = landmark.tags.landmarkLink;

const App = thisBot.getApp();

os.compileApp("landmarkInfoApp", <App />)