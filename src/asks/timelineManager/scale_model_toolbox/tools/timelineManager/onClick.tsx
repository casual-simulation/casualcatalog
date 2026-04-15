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

const unitButton = {
    ...menuOptions,
    label: 'set step unit: ' + (tags.timeUnit ?? ''),
    timelineManager_menuSortOrder: 1,
    dropdownSortOrder: 1,
    dropdownOptions: [
        {
            ...menuOptions,
            label: 'minute',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'hour',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'day',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'week',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'month',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'quarter',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'year',
            onClick: `@
                links.manager.tags.timeUnit = tags.label;
                links.manager.onClick();
            `
        }
    ]
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
        shout("clearTimelineManagerMenu");
    `
}

const stepDecreaseButton = {
    ...menuOptions,
    label: 'step',
    formAddress: 'remove',
    timelineManager_menuSortOrder: 4,
    onClick: `@
        links.manager.decreaseStep();
        shout("clearTimelineManagerMenu");
    `
}

ab.links.menu.abCreateMenuButton(resetButton); 
ab.links.menu.abCreateMenuDropdown(unitButton);
ab.links.menu.abCreateMenuButton(stepIncreaseButton);  
ab.links.menu.abCreateMenuButton(stepDecreaseButton);  
ab.links.menu.abCreateMenuButton(playPauseButton);  
