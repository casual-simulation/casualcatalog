const { menuType } = that ?? {};

const menuItems = [];

menuItems.push({
    label: 'ask ab',
    formAddress: 'cube',
    form: 'input',
    onCreate: ListenerString(() => {
        if (!authBot) {
            tags.label = "ask " + ab.links.personality.tags.abBuilderIdentity + " (limited)";
        } else if (authBot.tags.subscriptionTier == "FreePlay") {
            tags.label = "ask " + ab.links.personality.tags.abBuilderIdentity + " (limited)";
        } else {
            tags.label = "ask " + ab.links.personality.tags.abBuilderIdentity;
        }
    }),
    onSubmit: ListenerString(() => {
        os.toast('this is not the real ask input yet.');
    })
})

menuItems.push({
    label: "foo",
    onClick: ListenerString(() => {
        os.toast('bar');
    })
})

masks.menuItems = menuItems;