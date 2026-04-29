shout('abMenuRefresh');
shout("clearTimelineManagerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

configBot.tags.menuPortal = 'timelineManager_menu';

const menuOptions = {
    timelineManager_menu: true,
    clearTimelineManagerMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    manager: getLink(thisBot)
}

const resetButton = {
    ...menuOptions,
    label: 'reset',
    formAddress: 'refresh',
    timelineManager_menuSortOrder: 2,
    onClick: `@
        links.manager.resetTimeline();
        shout("clearTimelineManagerMenu");
    `
}

const playPauseButton = {
    ...menuOptions,
    label: tags.timelinePaused ? 'play' : 'pause',
    formAddress: tags.timelinePaused ? 'play_arrow' : 'pause',
    timelineManager_menuSortOrder: 3,
    onClick: `@
        links.manager.togglePauseTimeline();
        shout("clearTimelineManagerMenu");
    `
}

const stepIncreaseButton = {
    ...menuOptions,
    label: 'step',
    formAddress: 'add',
    timelineManager_menuSortOrder: 4,
    onClick: `@
        links.manager.increaseStep();
    `
}

const stepDecreaseButton = {
    ...menuOptions,
    label: 'step',
    formAddress: 'remove',
    timelineManager_menuSortOrder: 4,
    onClick: `@
        links.manager.decreaseStep();
    `
}

ab.links.menu.abCreateMenuButton(resetButton); 
ab.links.menu.abCreateMenuButton(stepIncreaseButton);  
ab.links.menu.abCreateMenuButton(stepDecreaseButton);  
ab.links.menu.abCreateMenuButton(playPauseButton);  
