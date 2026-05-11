if (!links.learn.abIsPrimary()) {
    return;
}

const instName = "studioInst_" + that.studioId;

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
    configBot.tags.pattern = "home";
    await os.sleep(0);

    os.loadInst({
        inst: instName,
        owner: that.studioId
    });
}