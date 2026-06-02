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

        if (initial) {
            // Show initial message if one is defined on abConfig.
            if (links.remember.tags.abInitialMessage) {
                shout("showConsole");

                if (Array.isArray(links.remember.tags.abInitialMessage)) {
                    const name = links.personality.tags.abBuilderIdentity;
                    const avatar = links.personality.tags.abBuilderAvatar;

                    // Fold the messages into one promise chain: each step logs a message
                    // and returns os.sleep(2000), so the next step waits 2s before running.
                    // The chain isn't awaited, so abSetAwake resolves immediately while the
                    // messages keep logging in the background.
                    links.remember.tags.abInitialMessage.reduce(
                        (chain, message) => chain.then(() => {
                            ab.log({ name, avatar, message, space: "shared" });
                            return os.sleep(2000);
                        }),
                        Promise.resolve()
                    );
                }
                else {
                    ab.log({ name: links.personality.tags.abBuilderIdentity, avatar: links.personality.tags.abBuilderAvatar, message: links.remember.tags.abInitialMessage, space: "shared" });
                }
            }
        }

    } else {
        destroy(links.abBot);

        shout("abMenuRefresh");
        shout("onABSleep");
    }
}