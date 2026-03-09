const needUpdateBillboardLabel = that.tags.some(t => t === 'bbLabel' || t === 'bbLabelFloatingBackgroundColor' || t === 'bbLabelColor');

if (needUpdateBillboardLabel && tags.ready) {
    thisBot.updateBillboardLabel();
}