if (tags.mode == "edit") {
    if (tags.homeRotationZ) {
        if (tags.homeRotationZ < -4.6) {
            tags.homeRotationZ = 0;
        }
        else {
            tags.homeRotationZ -= Math.PI / 2;
        }
    }
    else {
        tags.homeRotationZ = -Math.PI / 2;
    }
}