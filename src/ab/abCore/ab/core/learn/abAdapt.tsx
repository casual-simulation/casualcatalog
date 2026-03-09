let skillName;
let skillData;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (typeof that === 'string') {
    skillName = that;
    skillData = null;
} else if (typeof that === 'object') {
    skillName = that.systemID ?? that.skillName;
    skillData = that.data ?? null;
}

if (!skillName) {
    console.error(`[${tags.system}.${tagName}] skillName is required.`);
    return false;
}

if (skillName === 'abCore') {
    console.error(`[${tags.system}.${tagName}}] abConfig cannot be loaded using abAdapt.`);
    return;
}

try {
    const loadedSkills = thisBot.abLoadedSkills();

    if (!loadedSkills.includes(skillName)) {
        const url = thisBot.abBuildCasualCatalogURL(`/ab/${skillName}.aux`);
        const response = await web.hook({ method: "GET", url });

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ab skill GET response:`, response);
        }

        if (response.status !== 200) {
            console.log(`[${tags.system}.${tagName}] Could not download ${skillName}. Response: ${response.statusText}`);
            return;
        }
    
        if (response.data.version === 2) {
            // AUX Format Version 2.
            const updates = response.data.updates;
            await os.applyUpdatesToInst(updates);
            const state = await os.getInstStateFromUpdates(updates);
            const sourceHash = crypto.hash('sha1', 'hex', state);

            // Loaded skills are stored as shared bots that anyone in the inst can read.
            create({
                space: 'shared',
                abIgnore: true,
                abLoadedSkill: skillName,
                abLoadedSkillSourceHash: sourceHash,
                form: 'nothing',
            })
        } else {
            console.error(`[${tags.system}.${tagName}] AUX format version ${response.data.version} is not supported.`);
        }

    } else {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ab skill ${skillName} is already loaded.`)
        }
    }

    const skillBots = getBots(b => b.tags[skillName] === true);
    if (skillBots && skillBots.length > 0) {
        whisper(skillBots, tagName, configBot.tags.inst);
        whisper(skillBots, "onSkillUpdate", { data: skillData });
    } else {
        console.error(`[${tags.system}.${tagName}] No bots appear to have been loaded with ${skillName}.`);
        return false;
    }

    return true;
} catch (e) {
    console.error(e);
    console.error(`[${tags.system}.${tagName}] Failed to download ${skillName}. See above error.`);
    return false;
}