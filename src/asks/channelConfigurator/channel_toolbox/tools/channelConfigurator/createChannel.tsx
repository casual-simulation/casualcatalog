shout('clearChannelSetupMenu');

let bios = tags.chosenBIOS;
let instName = tags.chosenInstName;
let pattern = tags.chosenPattern;
let patternStudio = tags.chosenPatternStudio ?? authBot.id;
let channelName = tags.chosenChannelName;

//Create URL
const currentURL = new URL(configBot.tags.url);
const origin = currentURL.origin;

let newURL = new URL(origin);

if (abRemember.tags.allowChannels) {
    newURL.searchParams.append("channel", channelName);
}

if (configBot.tags.comId) {
    newURL.searchParams.append("comId", configBot.tags.comId);
}

tags.channelURL = newURL.href;

//create egg
const abArtifactShard = {
    data: {
        bios,
        instName,
        defaultPattern: pattern,
        defaultPatternStudio: patternStudio,
        channelName,
        onChannelLoaded: tags.channel_onChannelLoaded
    },
    dependencies: [
        {
            askID: 'channel'
        }
    ]
};
                
const channelEgg = await ab.links.artifact.abCreateArtifactPromiseBot({
                    abArtifactName: 'channel',
                    abArtifactInstanceID: uuid(),
                    abArtifactShard,
                });

console.log(`${tags.system}.${tagName}]: channel promise bot`, channelEgg);

//Publish to studio
if (!authBot) {
    console.log(`${tags.system}.${tagName}]: no authbot`);
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    console.log(`${tags.system}.${tagName}]: User not logged in.`);
    destroy(channelEgg);
    return;
}

const studio = configBot.tags.studio ?? authBot.id;
configBot.tags.selected_studioID = studio;

const publishAttempt = await ab.links.store.abPublishAB({
    ab: channelName,
    target: channelEgg,
    sourceEvent: 'channel_egg_publish',
    studio: studio,
    publicFacing: true,
    eggMarkerSet: new Set(['abChannel']),
    auxMarkerSet: new Set(['abChannel']),
});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
}

if (!publishAttempt.success) {
    const permissions = await os.grantInstAdminPermission(studio);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] saveData permissions:`, permissions);
    }

    const secondPublishAttempt = await ab.links.store.abPublishAB({
        ab: channelName,
        target: channelEgg,
        sourceEvent: 'channel_egg_publish',
        studio: studio,
        publicFacing: true,
        eggMarkerSet: new Set(['abChannel']),
        auxMarkerSet: new Set(['abChannel']),
    });
        
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}]  saveData publishAttempt 2`, secondPublishAttempt);
    }

    if (!secondPublishAttempt.success){
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Could not publish`, secondPublishAttempt);
        }
        os.toast("could not publish");
    } else {
        os.toast("Publishing successful");
        ab.links.manifestation.abSetAwake({ awake: true });
    }
} else {
    os.toast("Publishing successful");
}

//delete egg
destroy(channelEgg);

shout("abMenuRefresh");