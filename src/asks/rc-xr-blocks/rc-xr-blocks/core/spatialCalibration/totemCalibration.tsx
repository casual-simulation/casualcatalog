const {
    positionTotemA,
    positionTotemB,
} = that;

const dim = os.getCurrentDimension();
const posMid = vector3.lerp( positionTotemA, positionTotemB, 0.5 );

mainSceneBot.tags[`${dim}X`] = posMid.x;
mainSceneBot.tags[`${dim}Y`] = posMid.y;

const dir = math.subtractVectors( positionTotemB, positionTotemA );
const rotZ = Math.atan2( dir.y, dir.x ) - ( Math.PI / 2 );
mainSceneBot.tags[`${dim}RotationZ`] = rotZ;