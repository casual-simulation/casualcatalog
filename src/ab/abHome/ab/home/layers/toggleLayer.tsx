if (!links.learn.abIsPrimary()) {
    return;
}

let idString = that.studioId;
idString = idString.slice(0, 4);
let uuidString = uuid();
uuidString = uuidString.slice(0, 4);
const instName = idString + uuidString;

if (!tags.activeInsts) {
    setTagMask(thisBot, "activeInsts", []);
}

//check if inst is loaded
let instLoaded = false;
if (tags.activeInsts.find(item => item.includes(idString))) {
    instLoaded = true;
}

//if loaded, unload
if (instLoaded) {
    if (!that.keepLoaded) {
        os.unloadInst({
            staticInst: tags.activeInsts.find(item => item.includes(idString)),
        });
        console.log("unloading", tags.activeInsts.find(item => item.includes(idString)))
    }
}
//if unloaded, sideload it
else {
    console.log("loading", instName)
    let abWasAwake = false;
    if (configBot.tags.abStayAwake) {
        abWasAwake = true;
        configBot.tags.abStayAwake = false;
        await os.syncConfigBotTagsToURL(["abStayAwake"]);
    }
    masks.currLayerStudio = that.studioId;

    await os.sleep(0);

    await os.loadInst({
        staticInst: instName
    });

    if (abWasAwake) {
        configBot.tags.abStayAwake = true;
        await os.syncConfigBotTagsToURL(["abStayAwake"]);
    }
}