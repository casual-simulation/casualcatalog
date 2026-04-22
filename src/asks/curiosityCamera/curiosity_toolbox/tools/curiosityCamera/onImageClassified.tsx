const top = that.prediction.reduce((a, b) => 
    a.probability > b.probability ? a : b
);
if ((top.probability * 100).toFixed(0) > 80) {
    await os.closeImageClassifier();

    const discData = tags.discoverableData.find(item => item.attributes.Name == top.className);
    tags.discoverableURL = discData.attributes.GRPMUrl;

    thisBot.openApp();
}
