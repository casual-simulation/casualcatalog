shout('abMenuRefresh');
shout("clearTimelineMarkerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

configBot.tags.menuPortal = 'timelineMarker_menu';

const menuOptions = {
    timelineMarker_menu: true,
    clearTimelineMarkerMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    marker: getLink(thisBot)
}

const valueButton = {
    ...menuOptions,
    label: 'set delta multiplier',
    timelineMarker_menuSortOrder: 1,
    onInputTyping: `@
        links.marker.tags.timeValue = that.text;
    `,
    onCreate: `@
        masks.menuItemText = links.marker.tags.timeValue;
    `,
    onSubmit: `@
        links.marker.tags.timeValue = that.text;
    `
}

const unitButton = {
    ...menuOptions,
    label: 'set time unit: ' + (tags.timeUnit ?? ''),
    timelineMarker_menuSortOrder: 2,
    dropdownSortOrder: 2,
    dropdownOptions: [
        {
            ...menuOptions,
            label: 'minute',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'hour',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'day',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'week',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'month',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'quarter',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'year',
            onClick: `@
                links.marker.tags.timeUnit = tags.label;
                links.marker.onClick();
            `
        }
    ]
}

const setButton = {
    ...menuOptions,
    label: 'lock marker',
    timelineMarker_menuSortOrder: 3,
    formAddress: 'lock',
    onClick: `@
        const response = await os.showConfirm({
            title: 'Lock this marker?',
            content: 'you will not be able to edit this marker anymore'
        });
        if (response) {
            links.marker.tags.markerLocked = true;
            links.marker.tags.label = links.marker.tags.timeUnit + " " + links.marker.tags.timeValue;
        }
        shout("clearTimelineMarkerMenu");
    `
}


if (!tags.markerLocked) {
    ab.links.menu.abCreateMenuInput(valueButton);  
    ab.links.menu.abCreateMenuDropdown(unitButton);  
    ab.links.menu.abCreateMenuButton(setButton);
} else {
    shout("setDelta", {value: tags.timeValue, unit: tags.timeUnit});
}
