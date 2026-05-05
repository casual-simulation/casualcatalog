shout('abStudioConfiguratorMenuReset');

configBot.tags.menuPortal = 'abStudioConfiguratorMenu';

masks.open = true;

const BASE_TAGS = {
    abStudioConfiguratorMenu: true,
    abStudioConfiguratorMenuReset: ListenerString(() => {
        destroy(thisBot)
    })
}

const studioGroup = {
    ...BASE_TAGS,
    label: 'select studio:',
    dropdownSortOrder: 1,
    defaultOpen: true,
    configuratorBot: getLink(thisBot),
    dropdownOptions: []
}

const studioListResponse = await os.listUserStudios();

if (studioListResponse.success) {
    for (const studio of studioListResponse.studios) {
        studioGroup.dropdownOptions.push({
            ...BASE_TAGS,
            configuratorBot: getLink(thisBot),
            label: studio.displayName.toLocaleLowerCase(),
            formAddress: 'radio_button_unchecked',
            studioData: studio,
            onClick: ListenerString(() => {
                shout('abStudioConfiguratorMenuReset');
                setTagMask(links.configuratorBot, 'studioId', tags.studioData.studioId, 'local');
                ab.links.configurator.abOpenConfigurator({
                    abConfiguratorGroup: 'abStudioConfigurator',
                    abConfiguratorTitle: `configure studio:\n${tags.studioData.displayName}`,
                    bots: [links.configuratorBot]
                });
            })
        });
    }
}

ab.links.menu.abCreateMenuDropdown(studioGroup);
