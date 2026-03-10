if (thisBot.vars.loading) {
    return;
}

thisBot.vars.loading = true;

if (!authBot) {
    try { 
        await os.requestAuthBotInBackground();
    } catch {
        thisBot.vars.loading = false;
        return;
    }
}

if (!links.remember) {
    thisBot.vars.loading = false;
    return;
}

// Retrieve personality config from user's record.
let userPersonalityData = {};

if (authBot) {
    const getDataResponse = await os.getData(authBot.id, 'abPersonalityConfig');

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] getDataResponse:`, self.structuredClone(getDataResponse));
    }

    if (getDataResponse.success) {
        userPersonalityData = getDataResponse.data;
    } else {
        if (getDataResponse.errorCode !== 'data_not_found') {
            console.error(`[${tags.system}.${tagName}] abPersonalityConfig get error:`, { errorCode: getDataResponse.errorCode, errorMessage: getDataResponse.errorMessage });
            thisBot.vars.loading = false;
            return;
        }
    }
}

// Clear any previously loaded tags.
clearTagMasks(thisBot);

// Ryan (Aug 29, 2025): im not sure exactly what is happening here but without sleeping on these big tag mask changes, they dont all seem to come in properly.
await os.sleep(100);

// Load tags from either the user's personality config (if available) or load a default from the abConfig.
for (const tagName of tags.abPersonalityTags) {
    if (userPersonalityData[tagName] != null) {
        setTagMask(thisBot, tagName, userPersonalityData[tagName], 'local');

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] loaded '${tagName}' from user personality data:`, self.structuredClone(userPersonalityData[tagName]));
        }
    } else if (links.remember.tags[tagName] != null) {
        setTagMask(thisBot, tagName, links.remember.tags[tagName], 'local');

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] loaded '${tagName}' from ab config:`, self.structuredClone(links.remember.tags[tagName]));
        }
    }
    
    if (tagName === 'abBaseGridPortalColor') {
        gridPortalBot.tags.portalColor = tags.abBaseGridPortalColor;
    } else if (tagName === 'abMapPortalBase') {
        mapPortalBot.tags.mapPortalBasemap = tags.abMapPortalBase;
        miniMapPortalBot.tags.mapPortalBasemap = tags.abMapPortalBase;
    } else if (tagName === 'abPreferredAIModel') {
        // Check that this ai model is still available.
        const desiredModel = tags.abPreferredAIModel;
        const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
        let found = desiredModel && aiChatModels.some(e => e.name === desiredModel);

        if (!found) {
            // The abPreferredAIModel is not available. Try falling back to abConfig default.
            found = links.remember.tags.abPreferredAIModel && aiChatModels.some(e => e.name === links.remember.tags.abPreferredAIModel);
            if (found) {
                setTagMask(thisBot, 'abPreferredAIModel', links.remember.tags.abPreferredAIModel, 'local');

                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] abPreferredAIModel '${desiredModel}' is not available, falling back to abConfig default '${links.remember.tags.abPreferredAIModel}'`);
                }
            } else {
                // The abConfig default for abPreferredAIModel is not available. Fallback to the CasualOS default.
                const defaultModel = aiChatModels.find(e => e.isDefault).name;
                setTagMask(thisBot, 'abPreferredAIModel', defaultModel, 'local');
                
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] abPreferredAIModel '${desiredModel}' is not available, falling back to CasualOS default '${defaultModel}'`);
                }
            }

        }
    }
}

// Ryan (Aug 29, 2025): im not sure exactly what is happening here but without sleeping on these big tag mask changes, they dont all seem to come in properly.
await os.sleep(100);

thisBot.vars.loading = false;
shout('onABPersonalityLoaded', { bot: thisBot });