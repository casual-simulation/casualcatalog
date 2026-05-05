if (tags.strokeFormAddress) {
    const stroke = {
        form: 'mesh',
        formSubtype: 'gltf',
        formAddress: tags.strokeFormAddress,
        transformer: getID(thisBot),
        anchorPoint: 'top',
        [tags.dimension]: true,
        scaleMode: 'absolute',
        pointable: false,
        abIgnore: true
    }

    if (tags.strokeColor) {
        stroke.color = tags.strokeColor;
    }

    return create(stroke);
}