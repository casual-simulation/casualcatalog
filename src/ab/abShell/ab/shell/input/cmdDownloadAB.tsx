const args = that;

let auxVersion: string = ABCommandsManager.parseArgValue(args, '-v');

if (!auxVersion) {
    // Default to aux version 2 if argument is not provided.
    auxVersion = '2';
}

if (auxVersion !== '1' && auxVersion !== '2') {
    links.utils.abLogAndToast(`Only aux format version 1 and 2 are supported in the download ab command.`);
    return;
}

// links.manifestation.abSetAwake({ awake: false });

let groups = [];

if (args && args.length > 0) {
    // Remaining args are group names provided with the command.
    groups = args;
} else {
    let group = await os.showInput(masks.prevInputDownloadABGroup, { title: 'AB Group Tag', autoSelect: true });
    if (group) {
        masks.prevInputDownloadABGroup = group;
        groups.push(group);
    }
}

for (let group of groups) {
    const groupBots = getBots(byMod({ [group]: true, space: 'shared' }));

    if (group == "abConfig") {
        group = "ab1";
    }

    if (auxVersion === '1') {
        // Download as version 1
        os.downloadBots(groupBots, group)
    } else {
        // Download as version 2
        os.downloadBotsAsInitialzationUpdate(groupBots, group);
    }

}

