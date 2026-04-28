const top = that.prediction.reduce((a, b) => 
    a.probability > b.probability ? a : b
);
if ((top.probability * 100).toFixed(0) > tags.confidence_percentage) {

    if (tags.confidenceName != top.className) {
        tags.confidenceName = top.className;
        tags.confidenceCount = 1;
    } else {
        tags.confidenceCount += 1;
    }

    if (tags.confidenceName && tags.confidenceName != 'None' && tags.confidenceCount > tags.confidence_sequential) {
         await os.closeImageClassifier();

        const discData = tags.discoverableData.find(item => item.attributes.Name == top.className);
        tags.discoverableURL = discData.attributes.GRPMUrl;

        thisBot.openApp();
    }
}
