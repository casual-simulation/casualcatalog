/**
* MIT License
*
* Copyright (c) 2019 Casual Simulation, Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* @license MIT
*/

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] booting ab`);
}

//check self for initial boot data
let initialBoot = links.remember.tags.initialBoot ? true : false;

if (initialBoot) {
    thisBot.abBootStatusShow({ label: `starting up ${links.remember.tags.abBuilderIdentity}`});
}

//inst mode (player or builder)
let instModeCheck = await os.version().playerMode;
//check url for possible ab's to load
let bootFlag = configBot.tags.pattern ? configBot.tags.pattern : configBot.tags.ab;
//check for ask
let ask = configBot.tags.ask;
//seed (not actively used here)
let seed = configBot.tags.seed;
//prompt
let prompt = configBot.tags.prompt;
//channel
let channel = configBot.tags.channel;
//uuab
let uuab = configBot.tags.auxlink == "uuab";
//version
let version = configBot.tags.patternVersion ?? configBot.tags.abVersion;
//request auth bot
await os.requestAuthBotInBackground();

//redirect if in URL
if (configBot.tags.joinCode) {
    thisBot.abJoinHost({ text: configBot.tags.joinCode });
}

//check time if needed
if (links.remember.tags.abCondition) {
    await links.remember.abCondition();
}

//if no studio, set studio
if (authBot && !configBot.tags.studio) {
    configBot.tags.studio = authBot.id;
}

await Promise.allSettled([
    thisBot.abRefreshStudios(),
    thisBot.abRefreshAIModels()
]);

if (!links.personality) { 
    await thisBot.abAdapt("abPersonality");
}

//initialize some ab globals.
globalThis.ab = thisBot;
globalThis.abInstMemory = links.remember;
globalThis.abRemember = links.remember;
globalThis.abPersonality = links.personality;

if (links.remember.tags.abBaseGridPortalColor) {
    gridPortalBot.tags.portalColor = links.remember.tags.abBaseGridPortalColor;
}

//This checks for the appropriate array of skills and initializes them
await thisBot.abSkillInitialization(instModeCheck);

// initializing of some common skill globals.
globalThis.builderVersion = instModeCheck == "builder" ? true : false;
globalThis.abLongTermMemorySearch = links.search;
globalThis.abSearch = links.search;
globalThis.abPublish = links.store;
globalThis.abStore = links.store;

//check for uuabs
if (uuab) {
    await thisBot.abAdapt("abAction");

    links.ask.abCoreMenuAction({message: configBot.tags.uuab, isUUAB: true});
}
//check for channel if channels allowed
else if (channel && links.remember.tags.allowChannels) {
    await thisBot.abAdapt("abAction");

    links.ask.abCoreMenuAction({message: channel, isChannel: true});
} else {
    //populate bootflag ab
    if (initialBoot && bootFlag) {
        await links.search.onLookupABEggs({ abID: bootFlag, initialBoot: true, autoHatch: true, sourceEvent: 'boot', abVersion: version });
    }

    //lookup askID if available
    if (initialBoot && ask) {
        if (ask == "eggCarton" || ask == "casualTutorial") {
            await thisBot.abAdapt(ask);
        }
        else {
            await thisBot.abAdapt("abAction");

            links.ask.abCoreMenuAction(ask);
        }
    } 

    // load studio bootstrap egg (if it has one defined).
    const instStudioConfig = await links.search.abInstStudioConfig();
    if (initialBoot && instStudioConfig && instStudioConfig['studio_bootstrap_egg_name']) {
        await links.search.onLookupABEggs({ abID: instStudioConfig['studio_bootstrap_egg_name'], recordKey: instStudioConfig.studioId, initialBoot: true, autoHatch: true, sourceEvent: 'boot' });
    }
}

//check for artifact FIX
if (configBot.tags.artifact && initialBoot && !ask && !bootFlag) {
    const artifact = configBot.tags.artifact;
    const artIndex = artifact.indexOf("_art_");
    const studio = artifact.substring(0, artIndex);
    const recordAddress = artifact.substring(artIndex);
    const recordData = await os.getData(studio, recordAddress);
    const askID = recordData.data.pattern;

    await thisBot.abAdapt("abAction");

    links.ask.abCoreMenuAction(askID);
}

// Check if we can wake up ab, and then do so.
if (!configBot.tags.abSleep) {
    if ((initialBoot && !bootFlag && !ask) || links.remember.tags.abAlwaysStartAwake || configBot.tags.abStayAwake) {
        await links.manifestation.abSetAwake({ awake: true, initial: initialBoot });
    }
}

//set initial boot data
if (initialBoot) {
    setTagMask(links.remember, 'initialBoot', false, 'shared');

    if (links.remember.tags.abInitializationConfiguration) {
        links.remember.abInitializationConfiguration();
    }
}

//clean up URL with tagPortal
if (configBot.tags.tagPortal && !configBot.tags.tagPortalAnchorPoint && builderVersion) {
    configBot.tags.tagPortal = null;
    configBot.tags.tagPortalSpace = null;
}

//pause for ab loading.
await os.sleep(500);

//initialize time bot
thisBot.abTimer();

thisBot.abCreateUpdateChecker();
thisBot.abBootStatusClear();

//initialization shout
superShout("onABInitialized", tags.abInst);