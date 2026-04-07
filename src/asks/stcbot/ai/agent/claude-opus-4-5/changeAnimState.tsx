const state = that;

if (state !== tags.animState) {
    if (tags.debugAnim) {
        console.log(`[${tags.controllerName}.${tagName}]`, { to: state, from: tags.animState });
    }

    changeState(thisBot, state, 'animState');
} else {
    if (tags.debugAnim) {
        console.log(`[${tags.controllerName}.${tagName}] already in state: '${state}'`);
    }
}