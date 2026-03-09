if (!tags.enabled) {
    return;
}

const isMobile = configBot.tags.isMobile;
const inXR = configBot.tags.inVR || configBot.tags.inAR;

let pointerType;
if (os.getInputList().includes('rightPointer')) {
    pointerType = 'right';
} else if (os.getInputList().includes('leftPointer')) {
    pointerType = 'left';
} else if (isMobile && inXR) {
    pointerType = 'none';
} else {
    pointerType = 'mouse';
}

const pos = os.getPointerPosition(pointerType);
const dir = os.getPointerDirection(pointerType);
const hit = math.intersectPlane(pos, dir);

const setHomePos = (bot, pos) => {
    bot.tags.homeX = pos.x;
    bot.tags.homeY = pos.y;
    bot.tags.homeZ = pos.z;
}

if (hit) {
    let controllerType;
    let button;

    switch (pointerType) {
        case 'right':
            controllerType = 'rightPointer';
            button = 'primary';
            break;
        case 'left':
            controllerType = 'leftPointer';
            button = 'primary';
            break;
        case 'none':
            controllerType = 'nonePointer';
            button = 'primary';
            break;
        case 'mouse':
            controllerType = 'mousePointer';
            button = 'left';
            break;
    }
    
    let state = os.getInputState(controllerType, button);

    if (!masks.pointerDown) {
        if (state === 'down' || state === 'held') {
            masks.pointerDown = true;

            // On pointer down.
            let totem = thisBot.getUnsetTotem();

            if (totem) {
                totem.tags.home = true;
                setHomePos(totem, hit);
            }
        }
    } else {
        if (state === 'held') {
            // On pointer held.
            let totem = thisBot.getUnsetTotem();
            if (totem) {
                setHomePos(totem, hit);
            }
        } else if (!state) {
            masks.pointerDown = false;

            // On pointer up/click.
            let totem = thisBot.getUnsetTotem();
            if (totem) {
                console.log(`[totemInput] set totem pos: ${JSON.stringify(hit)}`);
                setHomePos(totem, hit);
                totem.tags.isSet = true;
                totem.tags.color = '#888';

                shout('onTotemSet', { totem });
            }

            totem = thisBot.getUnsetTotem();
            if (!totem) {
                // All totems are set.
                console.log(`[totemInput] all totems set`);
                shout('onTotemSetupComplete', { totemA: links.totemA, totemB: links.totemB });

                spatialCalibration.totemCalibration({
                    positionTotemA: transform.getBotPosition(links.totemA, 'home'),
                    positionTotemB: transform.getBotPosition(links.totemB, 'home')
                });

                thisBot.stop();
            }
        }
    }
}