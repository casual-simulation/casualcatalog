if (!links.learn.abIsPrimary()) {
    return;
}

let idString = that.studioId;
idString = idString.slice(-4);
const instName = "sti_" + idString;

if (!tags.activeInsts) {
    setTagMask(thisBot, "activeInsts", []);
}

//check if inst is loaded
let instLoaded = false;
if (tags.activeInsts.includes(instName)) {
    instLoaded = true;
}

//if loaded, unload
if (instLoaded) {
    os.unloadInst(instName);
    console.log("unloading", instName)
}
//if unloaded, sideload it
else {
    console.log("loading", instName)

    os.loadInst({
        inst: instName,
        record: that.studioId
    });
}