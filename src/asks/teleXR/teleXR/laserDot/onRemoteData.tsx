if (!masks.initialized) {
    return;
}

if (that.name === 'laser_dot_update') {
    const shoutResults = shout('onLaserDotUpdate', that.that);
    const laserUpdated = shoutResults.length > 0 && shoutResults.some(r => r === true);
    
    if (!laserUpdated) {
        // There was no laser bot that accepted the update, need to create a new one.

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] make laser dot bot:`, that.that);
        }

        // Destroy an laser dots that are for this remote before making a new one.
        const laserDotsForRemote = getBots(b => b.tags.remoteId === that.that.remoteId && b.tags.laserDot);
        destroy(laserDotsForRemote);

        const newLaserDot = create({
            space: 'tempLocal',
            form: 'sphere',
            laserDot: true,
            remoteId: that.that.remoteId,
            modality: that.that.modality,
            hand: that.that.hand,
            scale: 0.15,
            debug: tags.debug,
            timeoutMS: tags.laserDotTimeoutMS,
            pointable: false,
            onLaserDotUpdate: `@
                let {
                    botId,
                    botSpace,
                    botType,
                    videoFormAddress,
                    hitPointLocal,
                    dimension,
                    hitUV,
                    modality,
                    hand,
                    remoteId,
                    color,
                } = that;

                // Make sure that the incoming update is for this laser's remote and input type.
                if (modality != tags.modality ||
                    hand != tags.hand ||
                    remoteId != tags.remoteId
                ) {
                    return false;
                }

                // Find the bot that in our scene that this laser dot is supposed to be targeting.
                let bot;

                if (botSpace === 'shared' || botSpace === 'tempShared' || botSpace === 'remoteTempShared') {
                    bot = getBot('id', botId);
                } else if (botSpace === 'tempLocal' || botSpace === 'local') {
                    if (botType === 'videoBot') {
                        // Can find videoBot via the videoFormAddress.
                        bot = getBot(b => b.tags.videoBot && b.tags.formAddress === videoFormAddress);
                    }
                }

                if (!bot) {
                    return false;
                }

                // Clear timeout.
                if (thisBot.vars.timeoutId) {
                    clearTimeout(thisBot.vars.timeoutId);
                    thisBot.vars.timeoutId = null;
                }

                if (tags.color !== color) {
                    tags.color = color;
                }

                if (tags.dimension !== dimension) {
                    // Remove from current dimension.
                    tags[tags.dimension + 'X'] = null;
                    tags[tags.dimension + 'Y'] = null;
                    tags[tags.dimension + 'Z'] = null;
                    tags[tags.dimension] = null;

                    // Place in new dimension.
                    tags.dimension = dimension;
                    tags[dimension] = true;
                }

                const matrixWorld = TeleXR.math.matrix4.worldMatrixFromBot(bot, tags.dimension);
                const worldPosition = TeleXR.math.vector3.localToWorld(hitPointLocal, matrixWorld);

                tags[dimension + 'X'] = worldPosition.x;
                tags[dimension + 'Y'] = worldPosition.y;
                tags[dimension + 'Z'] = worldPosition.z;
                
                thisBot.vars.timeoutId = setTimeout(() => destroy(thisBot), tags.timeoutMS)
                
                return true;
            `,
            onDestroy: `@
                if (tags.debug) {
                    console.log('[laserDot.onDestroy]');
                }
            `
        })

        // Directly call onLaserUpdate the first time we make a new laser dot.
        newLaserDot.onLaserDotUpdate(that.that);
    }
}