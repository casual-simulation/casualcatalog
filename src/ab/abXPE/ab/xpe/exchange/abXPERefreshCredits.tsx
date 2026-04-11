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

const isStudioOwned = configBot.tags.owner &&
    configBot.tags.owner !== 'public' &&
    configBot.tags.owner !== 'player' &&
    configBot.tags.owner !== authBot.id;

let studioCredits = null;
let studioId = null;
if (isStudioOwned) {
    studioId = configBot.tags.owner;
    studioCredits = await thisBot.getAvailableCredits({ studioId });

    // Load studio display metadata once and store as a mask tag.
    if (!masks.studioConfig) {
        if (!configBot.tags.user_studios) {
            await ab.abRefreshStudios();
        }
        if (configBot.tags.user_studios?.success) {
            const ownerStudio = configBot.tags.user_studios.studios
                .find(s => s.studioId === studioId);
            if (ownerStudio) {
                const res = await os.getData(studioId, 'abStudioConfig');
                const data = res.success ? res.data : {};
                masks.studioConfig = {
                    displayName: ownerStudio.displayName,
                    creditIconUrl: data['studio_credit_icon_url'] ?? null,
                    creditBackgroundColor: data['studio_credit_background_color'] ?? null,
                };
            }
        }
    }
}

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

const prev = masks.availableCredits ?? {};

masks.availableCredits = {
    userCredits,
    userCreditsPrev: prev.userCredits ?? null,
    studioCredits,
    studioCreditsPrev: prev.studioCredits ?? null,
    studioId,
};

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

thisBot.vars.refreshCreditsTimeoutId = setTimeout(() => {
    whisper(thisBot, 'abXPERefreshCredits');
}, tags.creditsRefreshTimeoutMS);
