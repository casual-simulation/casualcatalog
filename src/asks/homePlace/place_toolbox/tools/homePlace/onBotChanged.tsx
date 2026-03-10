const needUpdateBillboardLabel = that.tags.some(t => t === 'placeLabel' || t === 'placeLabelFloatingBackgroundColor' || t === 'placeLabelColor');

if (needUpdateBillboardLabel && tags.ready) {
    thisBot.updateBillboardLabel();
}