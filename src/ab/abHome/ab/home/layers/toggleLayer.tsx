if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] inst: ${os.getCurrentInst()}, toggleLayer that:`, that);
}

if (!links.learn.abIsPrimary()) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] inst: ${os.getCurrentInst()}, non-primary instance. Ignoring toggleLayer.`);
    }
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

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] activeInsts:`, JSON.parse(JSON.stringify(tags.activeInsts)));
    console.log(`[${tags.system}.${tagName}] idString ${idString} instLoaded?`, instLoaded);
}

//if loaded, unload
if (instLoaded) {
    if (!that.keepLoaded) {
        const instName = tags.activeInsts.find(item => item.includes(idString));

        if (instName) {
            console.log("unloading", instName);
            os.unloadInst(instName);
        } else {
            console.warn(`Could not find instance with idString ${idString} to unload.`);
        }
    }
}
//if unloaded, sideload it
else {
    console.log("loading", instName);
    masks.currLayerStudio = that.studioId;

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] configBot tags:`, JSON.parse(JSON.stringify(configBot.tags)));
    }

    await os.sleep(0);

    os.loadInst(instName);
}