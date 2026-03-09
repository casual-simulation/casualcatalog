if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

const triggerBot = getBot("choosingTrigger", true);
const completionTriggerBot = getBot("choosingCompletionTrigger", true);

if (triggerBot) {
    if (triggerBot == thisBot) {
        tags.choosingTrigger = false;
        tags.choosingTriggerFilter = false;
    } else {
        if (triggerBot.tags.choosingTriggerFilter == true) {
            triggerBot.addTriggerFilter(thisBot);
        } else {
            triggerBot.addTrigger(thisBot);
        }
        tags.color = tags.prevColor;
        tags.prevColor = null;
        return;
    }
}

if (completionTriggerBot) {
    completionTriggerBot.addCompletionTrigger(thisBot);
    tags.color = tags.prevColor;
    tags.prevColor = null;
    return;
}

// os.toast('hello, world!');
shout('abMenuRefresh');
shout("clearSimActionMenu");

configBot.tags.menuPortal = 'simAction_menu';

const menuOptions = {
    simAction_menu: true,
    clearSimActionMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    action: getLink(thisBot)
}

const labelButton = {
    ...menuOptions,
    label: 'label: ' + tags.label,
    simAction_menuSortOrder: 1,
    onClick: `@
        const response = await os.showInput(links.action.tags.label, {
            autoSelect: true,
            title: 'label this action'
        });
        links.action.tags.label = response;
        links.action.onClick();
    `
}

const iconButton = {
    ...menuOptions,
    label: 'action icon',
    simAction_menuSortOrder: 2,
    onClick: `@
        const response = await os.showInput(links.action.tags.actionIcon, {
            autoSelect: true,
            title: 'Choose an icon',
            content: '(google material icon names)'
        });
        links.action.tags.actionIcon = response;
        links.action.onClick();
    `
}

if (!tags.roleTags) {
    tags.roleTags = [];
}
let tagString = "";
for (let i = 0; i < tags.roleTags.length; ++i) {
    tagString += i == 0 ? tags.roleTags[i] : (', ' + tags.roleTags[i]);
}

const addRoleTagButton = {
    ...menuOptions,
    label: 'add role tag: ' + tagString,
    simAction_menuSortOrder: 7,
    formAddress: 'add',
    onClick: `@
        const response = await os.showInput('', {
            autoSelect: true,
            title: 'add a role tag'
        });

        links.action.tags.roleTags.push(response);
        links.action.onClick();
    `
}

if (!tags.groupTags) {
    tags.groupTags = [];
}
let groupTagString = "";
for (let i = 0; i < tags.groupTags.length; ++i) {
    groupTagString += i == 0 ? tags.groupTags[i] : (', ' + tags.groupTags[i]);
}

const addGroupTagButton = {
    ...menuOptions,
    label: 'add group tag: ' + groupTagString,
    formAddress: 'add',
    simAction_menuSortOrder: 8,
    onClick: `@
        const response = await os.showInput('', {
            autoSelect: true,
            title: 'add a group tag'
        });

        links.action.tags.groupTags.push(response);
        links.action.onClick();
    `
}

const storyButton = {
    ...menuOptions,
    label: 'story',
    simAction_menuSortOrder: 4,
    onClick: `@
        const response = await os.showInput(links.action.tags.actionStory, {
            autoSelect: true,
            title: 'Provide a story for this action',
        });
        links.action.tags.actionStory = response;
        links.action.onClick();
    `
}

const startingActionButton = {
    ...menuOptions,
    label: 'starting action: ' + tags.startingAction,
    simAction_menuSortOrder: 3,
    onClick: `@
        links.action.tags.startingAction = links.action.tags.startingAction == true ? false : true;
        links.action.onClick();
    `
}

const triggerButton = {
    ...menuOptions,
    label: 'add a trigger',
    formAddress: 'add',
    simAction_menuSortOrder: 5,
    onClick: `@
        links.action.tags.choosingTrigger = true;
        shout("clearSimActionMenu");
    `
}

const triggerFilterButton = {
    ...menuOptions,
    label: 'add to trigger filter',
    simAction_menuSortOrder: 6,
    formAddress: 'add',
    onClick: `@
        links.action.tags.choosingTrigger = true;
        links.action.tags.choosingTriggerFilter = true;
        shout("clearSimActionMenu");
    `
}

ab.links.menu.abCreateMenuButton(labelButton);
ab.links.menu.abCreateMenuButton(iconButton);
ab.links.menu.abCreateMenuButton(startingActionButton);
ab.links.menu.abCreateMenuButton(storyButton);
ab.links.menu.abCreateMenuButton(triggerButton);
ab.links.menu.abCreateMenuButton(addRoleTagButton);
ab.links.menu.abCreateMenuButton(addGroupTagButton);
ab.links.menu.abCreateMenuButton(triggerFilterButton);