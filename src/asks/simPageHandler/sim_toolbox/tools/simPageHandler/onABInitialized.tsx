if (configBot.tags.placeAsk != (tags.simID + '_' + tags.pageID)) {
    return;
}

if (configBot.tags.staticInst || configBot.tags.tempInst) {
    shout("onRemoteData", {
        name: "onStartMenu",
        that: null,
        remoteId: getID(configBot)
    });
} else {
    const remotes = await os.remotes();
    await sendRemoteData(remotes, "onStartMenu");
}

const props = getBots("simProp", true);
for (const prop of props) {
    prop.tags.home = true;
    prop.tags.homeX = prop.tags[tags.pageID + 'X'];
    prop.tags.homeY = prop.tags[tags.pageID + 'Y'];
    prop.tags.homeZ = prop.tags[tags.pageID + 'Z'];
    prop.tags.propLocked = true;
}