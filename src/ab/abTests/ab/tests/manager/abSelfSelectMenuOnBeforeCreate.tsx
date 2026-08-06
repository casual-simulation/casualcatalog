const dropdownOptions = [];

const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const recordTest = {
    ...menuOptions,
    label: "record test",
    formAddress: "science",
    onClick: ListenerString(() => {
        shout('abRecordTest');
        shout('abMenuRefresh');
    }),
}

const recordTrace = {
    ...menuOptions,
    label: "record trace",
    formAddress: "timeline",
    onClick: ListenerString(() => {
        shout('abRecordTrace');
        shout('abMenuRefresh');
    }),
}


const commandBar = {
    ...menuOptions,
    label: "command bar",
    formAddress: "terminal",
    onClick: ListenerString(() => {
        shout('abChatBarOpen'); shout('abMenuRefresh');
    }),
}

const permaDelete = {
    ...menuOptions,
    label: "permanently delete",
    formAddress: "delete_forever",
    labelColor: 'black',
    onCreate: ListenerString(() => {
        tags.label += " " + ab.links.personality.tags.abBuilderIdentity;
        tags.color = ab.links.remember.tags.abBaseContrastColor ?? "#D93030";
    }),
    onClick: ListenerString(async () => {
        const confirmed = await os.showConfirm({
            title: 'Permanently delete ' + ab.links.personality.tags.abBuilderIdentity,
            content: 'Are you sure you want to delete ' + ab.links.personality.tags.abBuilderIdentity + ' from ' + ab.tags.abInst + '? This is not reversible!',
        })

        destroy(ab.links.manifestation.links.abBot);

        const abBots = getBots((b) => {
            return b.space === 'shared' &&
                b.tags.system &&
                b.tags.system.startsWith('ab');
        });

        if (confirmed) {
            destroy(abBots);
        }
    })
}

dropdownOptions.push(recordTest);
dropdownOptions.push(recordTrace);
dropdownOptions.push(commandBar);
dropdownOptions.push(permaDelete);

masks.dropdownOptions = dropdownOptions;