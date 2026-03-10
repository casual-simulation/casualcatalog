const needUpdateBillboardLabel = that.tags.some(t => t === 'placeLabel' || t === 'placeLabelFloatingBackgroundColor' || t === 'placeLabelColor');

if (needUpdateBillboardLabel && tags.ready) {
    thisBot.updateBillboardLabel();
}

if (that.tags.includes("strokeColor")) {
    if (links.strokeBot) {
        links.strokeBot.tags.color = tags.strokeColor;
    }
}