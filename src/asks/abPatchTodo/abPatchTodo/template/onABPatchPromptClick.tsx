tagPortalBot.tags.tagPortalAnchorPoint = 'top';
tagPortalBot.tags.tagPortalShowButton = true;
tagPortalBot.tags.tagPortalButtonIcon = 'close';
tagPortalBot.tags.tagPortalButtonHint = 'close prompt tag';
tagPortalBot.tags.onClick = ListenerString(() => {
    configBot.tags.tagPortal = null;
    tagPortalBot.tags.onClick = null;
    tagPortalBot.tags.tagPortalShowButton = null;
    tagPortalBot.tags.tagPortalButtonIcon = null;
})

configBot.tags.tagPortal = `${thisBot.id}.prompt`;