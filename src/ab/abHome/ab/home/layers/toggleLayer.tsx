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
        const instName = tags.activeInsts.find(item => item.includes(idString));
        os.unloadInst(instName);
        console.log("unloading", instName)
    }
}
//if unloaded, sideload it
else {
    console.log("loading", instName)
    masks.currLayerStudio = that.studioId;

    await os.sleep(0);

    await os.loadInst(instName);
}