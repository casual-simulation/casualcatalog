const { animation } = that;
const state = tags.animState;

const key = `${state}:${animation}`;
const nextState = tags.animTransitions?.[key];

if (tags.debugAnim) {
    console.log(`[${tags.controllerName}.${tagName}] transition lookup: '${key}' → ${nextState ?? '(no match, staying in ' + state + ')'}`);
}

if (nextState) {
    thisBot.changeAnimState(nextState);
}