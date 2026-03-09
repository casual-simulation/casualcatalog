const currentDimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;

let needUpdateBillboardLabel = false;
let needUpdatePatchColor = false;

for (const t of that.tags) {
    if (!needUpdateBillboardLabel) {
        needUpdateBillboardLabel = t === 'abPatchLabel' ||
                                   t === 'abPatchLabelColor' ||
                                   t === 'abPatchLabelBackgroundColor' ||
                                   t === currentDimension;
    }

    if (!needUpdatePatchColor) {
        needUpdatePatchColor = t === 'abPatchError' || t === 'abPatchInvalid';
    }
}

if (needUpdatePatchColor) {
    thisBot.updatePatchColor();
}

if (needUpdateBillboardLabel && tags.ready) {
    thisBot.updateBillboardLabel();
}