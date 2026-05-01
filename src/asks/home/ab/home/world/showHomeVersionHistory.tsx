const getRecord = await os.getData(configBot.tags.studio ?? authBot.id, 'home');
if (!getRecord.success) { 
    console.log("[place_toolbox.homePlace]: Could not fetch version history");
    return;
}

configBot.tags.menuPortal = "homeWorldVersionMenu";
shout("clearHomeWorldVersionMenu");

const homeWorldCore = getBot("isHomeWorldCore", true);

const keepCurrentButton = {
    homeWorldVersionMenu: true,
    clearHomeWorldVersionMenu: `@destroy(thisBot)`,
    label: "keep current version",
    onClick: `@
        shout("clearHomeWorldVersionMenu");
    `
}
ab.links.menu.abCreateMenuButton(keepCurrentButton);

let numShown = 0;
const reversedArr = getRecord.data.eggVersionHistory.reverse();
for (let i = 0; i < reversedArr.length; ++i) {
    if (i > 7) {
        return;
    }

    //Make a button
    const versionButton = {
        homeWorldVersionMenu: true,
        clearHomeWorldVersionMenu: `@destroy(thisBot)`,
        label: "version " + (i + 1),
        versionUrl: reversedArr[i],
        versionIndex: i + 1,
        studio: getLink(thisBot), 
        onClick: `@
            let confirmed = await os.showConfirm({
                title: 'Confirm',
                content: 'Please confirm you want to revert to this version.'
            });

            if (!confirmed) {
                shout("clearHomeWorldVersionMenu");
                return;
            }

            links.studio.changeHomeVersion(tags.versionIndex);
            shout("clearHomeWorldVersionMenu");
        `
    }

    ab.links.menu.abCreateMenuButton(versionButton);
}