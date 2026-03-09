const reloadPage = that?.reloadPage ?? true;
const showIndicator = that?.showIndicator ?? true;
const dryRun = that?.dryRun ?? false;

let busyIndicator;

if (showIndicator) {
    configBot.masks.menuPortal = 'updateABMenu';
    busyIndicator = await links.menu.abCreateMenuBusyIndicator({ updateABMenu: true, label: `updating ${links.personality.tags.abBuilderIdentity}` });
}

// Let all bots know that ab is about to update itself.
await Promise.allSettled(shout('onABBeforeUpdate'));

let overwriteResult;

try {
    // Update abConfig.
    const abConfigURL = os.getAB1BootstrapURL();
    const abConfigResponse = await webhook({ method: "GET", url: abConfigURL });

    assert(abConfigResponse.status === 200, `[${tags.system}.${tagName}] Could not download abConfig. Response: ${abConfigResponse.statusText}`);
    assert(abConfigResponse.data.version === 2, `[${tags.system}.${tagName}] abConfig must be in aux file format v2. Actual aux file format version: ${abConfigResponse.data.version}`);

    overwriteResult = await thisBot.auxV2Overwrite({ aux: abConfigResponse.data, groupTag: 'abConfig', dryRun });
    setTagMask(ab.links.remember, 'abConfigSourceHash', overwriteResult.sourceHash, 'shared');

    // Update ab skills.
    const loadedSkills = thisBot.abLoadedSkills();

    for (let skillName of loadedSkills) {
        const skillURL = thisBot.abBuildCasualCatalogURL(`/ab/${skillName}.aux`);

        // Skills can be restructured, meaning that they could be removed entirely in the future.
        // If a file fails to be retrieved, then remove all the bots in the group in the inst.
        let removeSkill = false;
        let skillResponse;

        try {
            skillResponse = await webhook({ method: "GET", url: skillURL });

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] skillResponse:`, skillResponse);
            }
            
            assert(skillResponse.data.version === 2, `[${tags.system}.${tagName}] ${skillName} must be in aux file format v2. Actual aux file format version: ${skillResponse.data.version}`);

            if (skillResponse.status !== 200) {
                if (skillResponse.status === 403 || skillResponse.status === 404) {
                    removeSkill = true;
                } else {
                    throw new Error(`[${tags.system}.${tagName}] Could not download ${skillName}. Response: ${skillResponse.statusText}`);
                }
            }
        } catch (e) {
            console.error(`[${tags.system}.${tagName}] caught error while downloading skill:`, e);
            
            if (e.response?.status === 403 || e.response?.status === 404) {
                // File doesnt exist anymore, the skill has been removed.
                removeSkill = true;
            } else {
                throw e;
            }
        }
        
        if (skillResponse && !removeSkill) {
            overwriteResult = await thisBot.auxV2Overwrite({ aux: skillResponse.data, groupTag: skillName, dryRun });

            const loadedSkillBot = getBot(b => b.tags.abLoadedSkill === skillName && b.space === 'shared');
            assert(loadedSkillBot, `[${tags.system}.${tagName}] could not find loaded skill bot for ${skillName}.`);
            
            setTagMask(loadedSkillBot, 'abLoadedSkillSourceHash', overwriteResult.sourceHash, 'shared');
        } else if (removeSkill) {
            const skillBots = getBots(b => b.tags[skillName] === true);

            if (dryRun) {
                console.log(`[${tags.system}.${tagName}] dry run: would delete ${skillBots.length} ${skillName} bot(s) because ${skillName} is no longer in the casual catalog.`)
                continue;
            }


            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] Skill ${skillName} is no longer in the casual catalog. Remove ${skillBots.length} ${skillName} bot(s) from inst.`);
            }

            destroy(skillBots);
        }
    }

    // Update abCore (do this one last!)
    const abCoreURL = thisBot.abBuildCasualCatalogURL('/ab/abCore.aux');
    const abCoreResponse = await web.hook({ method: "GET", url: abCoreURL });

    assert(abCoreResponse.status === 200, `[${tags.system}.${tagName}] Could not download abCore. Response: ${abCoreResponse.statusText}`);
    assert(abCoreResponse.data.version === 2, `[${tags.system}.${tagName}] abCore must be in aux file format v2. Actual aux file format version: ${abCoreResponse.data.version}`);

    overwriteResult = await thisBot.auxV2Overwrite({ aux: abCoreResponse.data, groupTag: 'abCore', dryRun });
    setTagMask(ab, 'abCoreSourceHash', overwriteResult.sourceHash, 'shared');
    
    // Let all bots know that ab is finished updating.
    await Promise.allSettled(shout('onABUpdated'));

    if (reloadPage) {
        const remoteDataEvent = 'update_ab_reload_page';
        const remoteDataArg = { reloadPage, dryRun };

        if (os.isCollaborative()) {
            const remotes = await os.remotes();
            sendRemoteData(remotes, remoteDataEvent, remoteDataArg);
        } else {
            thisBot.onRemoteData({ name: remoteDataEvent, that: remoteDataArg, remoteId: configBot.id });
        }
    }
} finally {
    if (busyIndicator) {
        destroy(busyIndicator);
        configBot.masks.menuPortal = null;
    }
}