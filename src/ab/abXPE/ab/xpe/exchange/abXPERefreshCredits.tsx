if (thisBot.vars.refreshCreditsTimeoutId) {
    clearTimeout(thisBot.vars.refreshCreditsTimeoutId);
    thisBot.vars.refreshCreditsTimeoutId = null;
}

const cycleId = uuid();
thisBot.vars.currentCycleId = cycleId;

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

const userCredits = await thisBot.getAvailableCredits({ userId: authBot.id });

let studioCredits = null;
let studioId = null;

const instStudioConfig = await ab.links.search.abInstStudioConfig();
if (instStudioConfig) {
    studioId = instStudioConfig.studioId;
    studioCredits = await thisBot.getAvailableCredits({ studioId });
}

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

const prev = masks.availableCredits ?? {};


if (prev.userCredits !== userCredits || prev.studioCredits !== studioCredits || prev.studioId !== studioId) {
    const newAvailableCredits = {
        userCredits,
        userCreditsPrev: prev.userCredits ?? null,
        studioCredits,
        studioCreditsPrev: prev.studioCredits ?? null,
        studioId,
    };
    setTagMask(thisBot, 'availableCredits', '🧬' + JSON.stringify(newAvailableCredits), 'tempLocal');
}

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

thisBot.vars.refreshCreditsTimeoutId = setTimeout(() => {
    whisper(thisBot, 'abXPERefreshCredits');
}, tags.creditsRefreshTimeoutMS);
