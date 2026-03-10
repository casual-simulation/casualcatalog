let { 
    initialBoot, // checks for initial boot boolean (optional)
    botData, // bots to be generated
    origin, // where did the data come from (optional)
    studio, // what studio is this data from (optional)
    record, // Ryan Cook: do we need this if we already have studio? (optional)
    version, // version of the data (optional)
    eggParameters, // data to pass to all created bots via @onEggHatch. (optional)
    ignoreGridFocus, // Ryan Cook: adding this as an optional flag. (optional)
    onPreprocessBeforeCreate, // callback function that can be used to preprocess the bot data before the bots are created. (optional)
    sourceEvent, // sourceEvent is an event name that symbolizes what triggered this call to abCreateBots. (optional).
} = that;

// Backwards compatibility for when abCreateBots expected "bots" parameter.
if (!botData && that.bots) {
    botData = that.bots;
}

let botCount = Object.keys(botData).length;
const botDataHashOriginal = crypto.hash('sha1', 'hex', botData);
const abGridFocus = links.remember.tags.abGridFocus;

// Run some ab-specific preprocessing of bot data.
for (const key in botData) {
    const data = botData[key];

    if (data.tags) {
        data.tags.abIDOrigin = origin;
        data.tags.abIDStudio = studio;

        if (data.tags.creator) {
            data.tags.oldCreator = data.tags.creator;
        }

        // Ryan Cook: This targetPosition stuff is apparently used for bot pasting? 
        // This is some really confusing logic and should be refactored eventually.
        if ((botCount < 2 || botCount < 3 && botData.abXPBot != null) && abGridFocus && !ignoreGridFocus) {
            data.tags[abGridFocus.dimension] = true;
            data.tags[abGridFocus.dimension + 'X'] = abGridFocus.position.x;
            data.tags[abGridFocus.dimension + 'Y'] = abGridFocus.position.y;
        }
    }
}

// Do another preprocessing pass that allows listeners to preprocess the bot data before the bots area created.
let preprocessArg = { botData, origin, studio, record, version, eggParameters, initialBoot, sourceEvent };

if (onPreprocessBeforeCreate) {
    await onPreprocessBeforeCreate(preprocessArg)
}

await Promise.allSettled(shout('onABPreprocessBeforeCreate', preprocessArg));

if (typeof botData !== 'object' || Object.keys(botData).length === 0) {
    // There isn't any botData to create from!
    return;
}

// Create bots from the bot data.
let idMap = new Map();
let newBots = [];
let newBotIds = [];

for (const key in botData) {
    const data = botData[key];

    if (data.tags) {
        try { 
            const newBot = create(data.tags);

            idMap.set(data.id, newBot.id);
            newBots.push(newBot);
            newBotIds.push(newBot.id);
        } catch (e) {
            console.log(`[${tags.system}.${tagName}] invalid bot`, e);
        }
    } else {
        console.log(`[${tags.system}.${tagName}] skipped bot: `, data);
    }
}

if (newBots.length > 0 && sourceEvent === 'paste') {
    ab.links.sound.abPlaySound({ value: ab.links.sound.tags.defaultCreateSound })
}

// Array of tag relationships to be preserved
const linkTags = ["link", "creator", "configBot", "lineTo", "transformer", "formLightTarget"];

// This loop contains the logic for preserving the linkTags
for (let newBot of newBots) {
    for (let tag of linkTags) {
        let value = newBot.tags[tag];

        if (tag == "creator") {
            value = newBot.tags.oldCreator;
            newBot.tags.oldCreator = null;
        }

        updateBotLinks(newBot, idMap);

        if (value) {
            if (Array.isArray(value)) {
                let newValue = value.map(id => {
                    return idMap.get(id) || id;
                })

                newBot.raw[tag] = newValue;
            }
            else {
                const newID = idMap.get(value);

                if (newID) {
                    newBot.raw[tag] = newID;
                }
            }
        }
    }
}

// Toasts for hatches, but only on builder
if (origin && version && configBot.tags.abSilentMode == null && !configBot.tags.ph && builderVersion == "builder") {
    os.toast("hatched " + origin + " v" + version);
}

// Create abEgg bot that tracks can be used to track what eggs have been hatched.
let abEggLabel;

if (origin) {
    if (version) {
        abEggLabel = `${origin} v${version}`;
    } else {
        abEggLabel = origin;
    }
} else {
    abEggLabel = 'unknown';
}

const abEgg = create({
    space: "shared",
    ab: true,
    abEgg: true,
    abIgnore: true,
    origin_ab: origin,
    origin_version: version,
    origin_record: record,
    origin_studio: studio,
    createdTimestamp: DateTime.fromMillis(os.isCollaborative() ? os.agreedUponTime : os.localTime),
    botIds: `🧬${JSON.stringify(newBotIds)}`,
    botDataHashOriginal,
    sourceEvent,
    inst: ab.tags.abInst,
    form: "egg",
    eggParameters: eggParameters ? `🧬${JSON.stringify(eggParameters)}` : null,
    color: links.personality.tags.abBaseColor,
    labelColor: links.remember.tags.abBaseLabelColor,
    label: abEggLabel,
    hatcherRemoteId: configBot.id,
});

configBot.tags.lastEggHatched = origin;

whisper(newBots, 'onPreHatch', { ab: origin, version, inst: ab.tags.abInst, botIds: newBotIds, sourceEvent });

if (initialBoot) {
    links.remember.tags.baseAB = origin;
}

// onEggHatch for all just hatched bots
whisper(newBots, "onEggHatch", { ab: origin, version, inst: ab.tags.abInst, botIds: newBotIds, eggParameters, sourceEvent });

// onAbAdded for all bots in the experience
superShout("onABAdded", { ab: origin, version, inst: ab.tags.abInst, botIds: newBotIds, sourceEvent });
superShout("onAbAdded", { ab: origin, version, inst: ab.tags.abInst, botIds: newBotIds, sourceEvent }); // Backwards compatibility.

if (os.isCollaborative()) {
    // Remote shout to all other connected remotes that a remote has added an ab.
    const remoteIds = await os.remotes();
    const selfIndex = remoteIds.indexOf(configBot.id);
    if (selfIndex > 0) {
        remoteIds.splice(selfIndex, 1);
    }

    sendRemoteData(remoteIds, 'remote_ab_added', { ab: origin, version, inst: ab.tags.abInst, botIds: newBotIds, sourceEvent, abEggId: abEgg.id });
}

return newBots;