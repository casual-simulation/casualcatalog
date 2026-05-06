shout('clearEggVersionMenu');

configBot.tags.menuPortal = 'eggVersionMenu';

const menuTags = {
    clearEggVersionMenu: `@destroy(thisBot);`,
    eggVersionMenu: true,
    eggConfigurator: getLink(thisBot)
}

//VERSION
if (tags.chosenEggName && authBot && tags.eggConfigConfirmed) {
    let dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);

    if (!dataResponse.success) {
        if(dataResponse.errorCode && dataResponse.errorCode == 'not_authorized') {
            await os.grantInstAdminPermission(tags.chosenStudio ?? authBot.id);
            dataResponse = await os.getData(tags.chosenStudio ?? authBot.id, tags.chosenEggName);
        }
    }

    if (dataResponse.success && !tags.chosenStudio) {
        tags.chosenStudio = tags.chosenStudio ?? authBot.id;
    }

    if(dataResponse.success) {
        tags.maxEggVersion = dataResponse.data.maxVersion;
        const dropdownOuterButton = {
            ...menuTags,
            dropdownSortOrder: 4,
            defaultOpen: true,
            label: "version: " + (tags.chosenVersionNumber == tags.maxEggVersion ? 'current' : tags.chosenVersionNumber ?? 'current')
        }

        const dropdownOptions = [];
        const reversedArr = dataResponse.data?.eggVersionHistory;
        for (let i = ((reversedArr.length - 1) > 7 ? 7 : (reversedArr.length - 1)); i >= 0; --i) {

            //Make a button
            const versionButton = {
                ...menuTags,
                label: i == (reversedArr.length - 1) ? "current" : "version " + (i + 1),
                versionUrl: reversedArr[i],
                versionIndex: i + 1,
                onClick: `@

                    links.eggConfigurator.tags.chosenVersionNumber = tags.versionIndex;
                    links.eggConfigurator.showTestMenu();
                `
            }

            dropdownOptions.push(versionButton);
        }

        dropdownOuterButton.dropdownOptions = dropdownOptions;

        ab.links.menu.abCreateMenuDropdown(dropdownOuterButton)
    }
}