shout('clearUUABSetupMenu');

//Publish to studio
if (!authBot) {
    console.log(`${tags.system}.${tagName}]: no authbot`);
    await os.requestAuthBotInBackground();
}

let bios = tags.chosenBIOS;
let instName = tags.chosenInstName;
let pattern = tags.chosenPattern;
let patternStudio = tags.chosenPatternStudio ?? authBot?.id ?? '';
let uuabName = tags.chosenUUABName;

//Create URL
const currentURL = new URL(configBot.tags.url);
const origin = currentURL.origin;

let newURL = new URL(origin);

newURL.searchParams.append("uuab", uuabName);

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
        uuabName,
        onUUABLoaded: tags.uuab_onUUABLoaded
    },
    dependencies: [
        {
            askID: 'uuab'
        }
    ]
};
                
const uuabEgg = await ab.links.artifact.abCreateArtifactPromiseBot({
                    abArtifactName: 'uuab',
                    abArtifactInstanceID: uuid(),
                    abArtifactShard,
                });

console.log(`${tags.system}.${tagName}]: uuab promise bot`, uuabEgg);

if (!authBot) {
    console.log(`${tags.system}.${tagName}]: User not logged in.`);
    destroy(uuabEgg);
    return;
}

const studio = configBot.tags.studio ?? authBot.id;
configBot.tags.selected_studioID = studio;

const publishAttempt = await ab.links.store.abPublishAB({ab: uuabName, target: uuabEgg, sourceEvent: 'uuab_egg_publish', studio: studio, publicFacing: true});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
}

if (!publishAttempt.success) {
    const permissions = await os.grantInstAdminPermission(studio);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] saveData permissions:`, permissions);
    }

    const secondPublishAttempt = await ab.links.store.abPublishAB({ab: uuabName, target: uuabEgg, sourceEvent: 'uuab_egg_publish', studio: studio, publicFacing: true});
        
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
destroy(uuabEgg);

shout("abMenuRefresh");