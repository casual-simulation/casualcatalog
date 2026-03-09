let awake = that?.awake;
let initial = that?.initial ?? false;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

assert(typeof awake === 'boolean', `[${tags.system}.${tagName}] awake is a required boolean parameter.`);

if (configBot.tags.abStayAwake) {
    // If abStayAwake is enabled, override the incoming awake parameter and never let ab be put to sleep.
    awake = true;
}

if (tags.abAwake !== awake) {
    if (initial) {
        if (configBot.tags.pattern) {
            links.remember.tags.baseAB = configBot.tags.pattern;
        } else {
            links.remember.tags.baseAB = uuid();
        }
        
        // Play initial animation if one is defined on abConfig.
        if (links.remember.tags.abInitialAnimation) {
            await links.animation[links.remember.tags.abInitialAnimation]();
        }
        
        // Show initial message if one is defined on abConfig.
        if (links.remember.tags.abInitialMessage) {
            shout("showConsole");

            if (Array.isArray(links.remember.tags.abInitialMessage)) {
                for (let i = 0; i < links.remember.tags.abInitialMessage.length; i++) {
                    ab.log(links.personality.tags.abBuilderIdentity + ": " + links.remember.tags.abInitialMessage[i]);

                    await os.sleep(2000);
                }
            }
            else {
                ab.log(links.personality.tags.abBuilderIdentity + ": " + links.remember.tags.abInitialMessage);
            }
        }
    }

    // Update abAwake shared tag mask.
    setTagMask(thisBot, 'abAwake', awake, 'shared');
    
    if (awake) {
        let dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;

        if (!dimension) {
            return;
        }

        const position = { x: 0, y: 0 };

        await thisBot.abManifestBot({ dimension, position });

        shout("onABAwake", { dimension, position, initial });
    } else {
        destroy(links.abBot);

        shout("abMenuRefresh");
        shout("onABSleep");
    }
}