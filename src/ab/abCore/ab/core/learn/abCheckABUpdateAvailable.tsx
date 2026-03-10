const detailed = that?.detailed ?? false;
const hashAlgorithm = that?.hashAlgorithm ?? 'sha1';
const hashFormat = that?.hashFormat ?? 'hex';

interface ABFileUpdateCheck {
    fileName: string;
    updateAvailable: boolean;
    currentHash: string;
    latestHash: string;
    removed: boolean;
}

// This list of ab file checks, this will only be populated if 'detailed' is true.
const abFileChecks: ABFileUpdateCheck[] = [];

async function checkSkillOutdated(skillName: string, currentHash: string): Promise<boolean> {
    const skillURL = thisBot.abBuildCasualCatalogURL(`/ab/${skillName}.aux`);        
    let skillRemoved = false;
    let skillResponse;

    try {
        skillResponse = await webhook({ method: "GET", url: skillURL });

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] skillResponse:`, skillResponse);
        }
        
        assert(skillResponse.data.version === 2, `[${tags.system}.${tagName}] ${skillName} must be in aux file format v2. Actual aux file format version: ${skillResponse.data.version}`);

        if (skillResponse.status !== 200) {
            if (skillResponse.status === 403 || skillResponse.status === 404) {
                skillRemoved = true;
            } else {
                throw new Error(`[${tags.system}.${tagName}] Could not download ${skillName}. Response: ${skillResponse.statusText}`);
            }
        }
    } catch (e) {
        console.error(`[${tags.system}.${tagName}] caught error while downloading skill:`, e);
        
        if (e.response?.status === 403 || e.response?.status === 404) {
            // File doesnt exist anymore, the skill has been removed.
            skillRemoved = true;
        } else {
            throw e;
        }
    }

    if (skillRemoved) {
        if (detailed) {
            abFileChecks.push({
                fileName: skillName,
                currentHash,
                latestHash: null,
                removed: true,
                updateAvailable: true,
            })
        }

        return true;
    } else {
        // Calculate hash of ab file state to compare against.
        const state = await os.getInstStateFromUpdates(skillResponse.data.updates);
        const latestHash = crypto.hash(hashAlgorithm, hashFormat, state);
        
        if (detailed) {
            abFileChecks.push({
                fileName: skillName,
                currentHash,
                latestHash,
                removed: false,
                updateAvailable: currentHash !== latestHash,
                latestUpdates: skillResponse.data.updates,
                latestState: state,
            })
        }

        return currentHash !== latestHash;
    }
}

// 1. Check if abConfig is outdated.
const abConfigURL = os.getAB1BootstrapURL();
const abConfigResponse = await webhook({ method: "GET", url: abConfigURL });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] abConfigResponse:`, abConfigResponse);
}

assert(abConfigResponse.status === 200, `[${tags.system}.${tagName}] Could not download abConfig. Response: ${abConfigResponse.statusText}`);
assert(abConfigResponse.data.version === 2, `[${tags.system}.${tagName}] abConfig must be in aux file format v2. Actual aux file format version: ${abConfigResponse.data.version}`);

const abConfigCurrentHash = ab.links.remember.tags.abConfigSourceHash;
const abConfigLatestState = await os.getInstStateFromUpdates(abConfigResponse.data.updates);
for (let id in abConfigLatestState) {
    delete abConfigLatestState[id].tags.baseAB; // baseAB is an annoying tag that should not be computed as part of hash state.
}
const abConfigLatestHash = crypto.hash(hashAlgorithm, hashFormat, abConfigLatestState);

if (detailed) {
    abFileChecks.push({
        fileName: 'abConfig',
        currentHash: abConfigCurrentHash,
        latestHash: abConfigLatestHash,
        removed: false,
        updateAvailable: abConfigCurrentHash !== abConfigLatestHash,
        latestUpdates: abConfigResponse.data.updates,
        latestState: abConfigLatestState,
    })
}

if (!detailed && (abConfigCurrentHash !== abConfigLatestHash)) {
    // If we are running in simple mode, return right away on the first outdated file discovery.
    return { success: true, updateAvailable: true }
}

// 2. Check if ab skills are outdated.
const abSkillNames = [ 'abCore', ...thisBot.abLoadedSkills() ];

for (let i = 0; i < abSkillNames.length; i++) {
    const skillName = abSkillNames[i];

    let skillCurrentHash;
    if (skillName === 'abCore') {
        skillCurrentHash = ab.tags.abCoreSourceHash;
    } else {
        const loadedSkillBot = getBot(b => b.tags.abLoadedSkill === skillName && b.space === 'shared');
        assert(loadedSkillBot, `[${tags.system}.${tagName}] could not find loaded skill bot for ${skillName}.`);

        skillCurrentHash = loadedSkillBot.tags.abLoadedSkillSourceHash;
    }
    
    try {
        const skillOutdated = await checkSkillOutdated(skillName, skillCurrentHash);

        if (!detailed && skillOutdated) {
            // If we are running in simple mode, return right away on the first outdated file discovery.
            return { success: true, updateAvailable: true }
        }
    } catch (e) {
        console.error(`[${tags.system}.${tagName}] Caugh an error.`, e);
        return { success: false }
    }
}

if (detailed) {
    return {
        success: true,
        updateAvailable: abFileChecks.some(f => f.updateAvailable),
        abFileChecks,
    }
} else {
    // If we made it all the way here in simple mode, there are no outdated files.
    return { success: true, updateAvailable: false }
}