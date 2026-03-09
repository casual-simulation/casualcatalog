clearAnimations(thisBot);

const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
let currentRotZ = tags[dimension + 'RotationZ'] ?? 0;

function getNextOrthogonalSpin(currentRotZ) {
    const HALF_TURN = Math.PI;
    const QUARTER_TURN = Math.PI / 2;

    const minTarget = currentRotZ + HALF_TURN;
    const nextMultiple = Math.ceil(minTarget / QUARTER_TURN) * QUARTER_TURN;
    return nextMultiple;
}

const targetRotZ = getNextOrthogonalSpin(currentRotZ);

await animateTag(thisBot, {
    fromValue: {
        [dimension + 'RotationZ']: currentRotZ,
    },
    toValue: {
        [dimension + 'RotationZ']: targetRotZ,
    },
    easing: {
        type: "sinusoidal",
        mode: "inout"
    },
    duration: 0.5,
    tagMaskSpace: 'tempLocal',
}).catch(() => {});

masks[dimension + 'RotationZ'] = null;