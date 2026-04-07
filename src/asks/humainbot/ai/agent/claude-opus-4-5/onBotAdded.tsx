// MUST run this before triggering animations. Without it, animations may try to trigger before the animation system is ready.
tags.formAnimations = await os.listFormAnimations(thisBot);
tags.animationsLoaded = true;

const activeRequestGPTs = getBots((b) => { return b.tags.abActiveRequestGPT && b.tags.input?.sourceId === (tags.gptSourceId ?? thisBot.id) });

if (tags.debugAnim) {
    console.log(`[${tags.controllerName}.${tagName}] active request gpts for ${tags.gptSourceId ?? thisBot.id}:`, activeRequestGPTs.length);
}

if (activeRequestGPTs.length > 0) {
    thisBot.changeAnimState('Thinking');
} else {
    thisBot.changeAnimState('Idle');
}