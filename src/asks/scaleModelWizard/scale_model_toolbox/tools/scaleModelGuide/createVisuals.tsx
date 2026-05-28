const base = that.base;

for (let i = 0; i < that.visualData.length; ++i) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? 'home'
    create({
        name: that.visualData[i].name,
        scaleX: that.visualData[i].scale.x,
        scaleY: that.visualData[i].scale.y,
        scaleZ: that.visualData[i].scale.z,
        [dimension]: true,
        [dimension + 'X']: that.visualData[i].position.x,
        [dimension + 'Y']: that.visualData[i].position.y,
        [dimension + 'Z']: that.visualData[i].position.z,
        form: that.visualData[i].form,
        label: that.visualData[i].label,
        [dimension + 'RotationX']: that.visualData[i].position.x,
        [dimension + 'RotationY']: that.visualData[i].position.y,
        [dimension + 'RotationZ']: that.visualData[i].position.z,
        transformer: base,
        pointable: false
    })
}