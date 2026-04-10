shout('abStudioConfiguratorMenuReset');

configBot.tags.menuPortal = 'abStudioConfiguratorMenu';

masks.open = true;

const BASE_TAGS = {
    abStudioConfiguratorMenu: true,
    abStudioConfiguratorMenuReset: ListenerString(() => {
        destroy(thisBot)
    })
}

ab.links.menu.abCreateMenuGroup({
    ...BASE_TAGS,
    groupSortOrder: 1,
    configuratorBot: getLink(thisBot),
    menuItems: [
        {
            label: 'enter studio id:',
            menuItemLabelStyle: {
                'font-weight': 'bold',
            },
            menuItemType: 'text',
        },
        {
            menuItemType: 'input',
            menuItemShowSubmitWhenEmpty: true,
            menuItemText: tags.studioId,
            onSubmit: ListenerString(() => {
                const { text } = that;

                shout('abStudioConfiguratorMenuReset');

                if (text) {
                    setTagMask(links.configuratorBot, 'studioId', text, 'local');
                    ab.links.configurator.abOpenConfigurator({ 
                        abConfiguratorGroup: 'abStudioConfigurator', 
                        abConfiguratorTitle: `configure studio:\n${text}`,
                        bots: [links.configuratorBot] });
                } else {
                    setTagMask(links.configuratorBot, 'studioId', null, 'local');
                }
            })
        }
    ]
})