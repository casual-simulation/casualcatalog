if (configBot.tags.staticInst) {
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
    prop.tags.homeX = props.tags[tags.pageID + 'X'];
    prop.tags.homeY = props.tags[tags.pageID + 'Y'];
    prop.tags.homeZ = props.tags[tags.pageID + 'Z'];
}