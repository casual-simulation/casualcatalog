if("rot.players." + configBot.id !== tags.system){
    return;
}
const dim: string = that.dimension ?? os.getCurrentDimension();

const fromObject = {};
fromObject[`${dim}X`] = tags[`${dim}X`] ?? 0;
fromObject[`${dim}Y`] = tags[`${dim}Y`] ?? 0;

const toObject = {};
toObject[`${dim}X`] = that?.x ?? 0;
toObject[`${dim}Y`] = that?.y ?? 0;

thisBot.toggleVisibleArtifacts()

await animateTag(thisBot, {
    fromValue: fromObject,
    toValue: toObject,
    duration: tags.moveTime,
    tagMaskSpace: "local"
})
