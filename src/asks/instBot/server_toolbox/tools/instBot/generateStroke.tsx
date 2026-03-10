const stroke = {
    form: 'mesh',
    formSubtype: 'gltf',
    formAddress: tags.strokeFormAddress,
    transformer: getID(thisBot),
    anchorPoint: 'top',
    [tags.dimension]: true,
    scaleMode: 'absolute',
    pointable: false
}

if (tags.strokeColor) {
    stroke.color = tags.strokeColor;
}

const strokeBot = create(stroke);

return strokeBot;