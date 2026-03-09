if (thisBot.vars.nudgeActive) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] there is already a nudge in progress.`);
    }
    return;
}

thisBot.vars.nudgeActive = true;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] starting nudge...`)
}

function canNudge(): boolean {
    // Can't have placed the arm already.
    if (tags.hasArmBeenPlaced) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] cannot nudge: arm placement has already occured.`);
        }
        return false;
    }

    // AB manifestation bot must be active.
    if (!links.manifestation.links.abBot) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] cannot nudge: ab manifestation bot is inactive.`);
        }
        return false;
    }

    // AB chat bar must be closed.
    if (links.input.masks.chatOpen) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] cannot nudge: ab chat bar is open.`);
        }
        return false;
    }

    // The inst must be empty of all bots. The exceptions are ab bots and built-in bots.
    const userMadeBot = getBot((b) => {
        return !b.tags.system?.startsWith('ab.') &&
                b.space === 'shared' &&
                !b.tags.abEgg && // Don't include abEgg bots as "user made".
                !b.tags.abLoadedSkill && // Don't include loaded skill bots as "user made".
                !b.tags.abBot // Don't include any bots that are flagged with an abBot tag.
    })
    
    if (userMadeBot) {
        if (tags.debug) {
            if (tags.debugUserMadeBots) {
                const userMadeBots = getBots((b) => {
                    return !b.tags.system?.startsWith('ab.') &&
                            b.space === 'shared' &&
                            !b.tags.abEgg // Don't include abEgg bots as "user made".
                })
                console.log(`[${tags.system}.${tagName}] cannot nudge: inst contains user made bots.`, userMadeBots);
            } else {
                console.log(`[${tags.system}.${tagName}] cannot nudge: inst contains user made bots.`);
            }
        }
        return false;
    }

    // Menu portal must either be inactive or not have any bots in the currently active menu portal.
    if (configBot.tags.menuPortal) {
        const botInMenuPortal = getBot((b) => {
            return b.tags[configBot.tags.menuPortal] === true
        });

        if (botInMenuPortal) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] cannot nudge: menuPortal is currently open and has bots in it.`);
            }
            return false;
        }
    }

    return true;
}

if (canNudge()) {
    // Start nudge for arm placement.
    await os.sleep(tags.armNudgeWaitMS);

    if (canNudge()) {
        const abPositionX = links.manifestation.links.abBot.tags[links.remember.tags.abActiveDimension + 'X'];
        const abPositionY = links.manifestation.links.abBot.tags[links.remember.tags.abActiveDimension + 'Y'];

        const gridClickParams = {
            dimension: links.remember.tags.abActiveDimension,
            position: { x: abPositionX + 5, y: abPositionY },
            forceArmPlacement: true,
        }

        if (configBot.tags.mapPortal === links.remember.tags.abActiveDimension) {
            // Map portal is in different coordinate space and scale.
            gridClickParams.position.x = abPositionX + 0.0003574340684053823;
        }

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] whispering onGridClick to the ab manifestation bot with the params:`, gridClickParams)
        }

        // Force ab arm placement using the onGridClick listener of the manifestation bot.
        whisper(links.manifestation, 'onGridClick', gridClickParams);
    }
}

thisBot.vars.nudgeActive = false;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] done`);
}