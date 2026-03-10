const changedTags = that.tags;

const updateLiquid = changedTags.some(t => t === 'fillAmount' || t === 'filledScaleZ' || t === 'fillColor');
if (updateLiquid) {
    thisBot.updateLiquid();
}