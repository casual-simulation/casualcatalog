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
    reaction: getLink(thisBot)
}

const labelButton = {
    ...menuOptions,
    label: 'label: ' + tags.label,
    simAction_menuSortOrder: 1,
    onClick: `@
        const response = await os.showInput(links.reaction.tags.label, {
            autoSelect: true,
            title: 'label this action'
        });
        links.reaction.tags.label = response;
        links.reaction.onClick();
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
    formAddress: 'add',
    simAction_menuSortOrder: 7,
    onClick: `@
        const response = await os.showInput('', {
            autoSelect: true,
            title: 'add a role/prop'
        });

        links.reaction.tags.roleTags.push(response);
        links.reaction.onClick();
    `
}

const storyButton = {
    ...menuOptions,
    label: 'story',
    simAction_menuSortOrder: 4,
    onClick: `@
        const response = await os.showInput(links.reaction.tags.actionStory, {
            autoSelect: true,
            title: 'Provide a story for this action',
        });
        links.reaction.tags.actionStory = response;
        links.reaction.onClick();
    `
}

const triggerButton = {
    ...menuOptions,
    label: 'add a trigger',
    formAddress: 'add',
    simAction_menuSortOrder: 5,
    onClick: `@
        links.reaction.tags.choosingTrigger = true;
        shout("clearSimActionMenu");
    `
}

const attributeButton = {
    ...menuOptions,
    label: 'stat: ' + (tags.reactionAttribute ?? ""),
    simAction_menuSortOrder: 8,
    onClick: `@
        const response = await os.showInput(links.reaction.tags.reactionAttribute, {
            autoSelect: true,
            title: 'What stat should be affected?',
        });
        links.reaction.tags.reactionAttribute = response;
        links.reaction.onClick();
    `
}

const effectButton = {
    ...menuOptions,
    label: 'effect: ' + (tags.reactionEffect ?? "+"),
    dropdownSortOrder: 9,
    dropdownOptions: [
        {
            ...menuOptions,
            label: '+',
            onClick: `@
                links.reaction.tags.reactionEffect = tags.label;
                links.reaction.onClick();
            `
        },
        {
            ...menuOptions,
            label: '-',
            onClick: `@
                links.reaction.tags.reactionEffect = tags.label;
                links.reaction.onClick();
            `
        },
        {
            ...menuOptions,
            label: '=',
            onClick: `@
                links.reaction.tags.reactionEffect = tags.label;
                links.reaction.onClick();
            `
        },
        {
            ...menuOptions,
            label: '==',
            onClick: `@
                links.reaction.tags.reactionEffect = tags.label;
                links.reaction.onClick();
            `
        }
    ]
}

const valueButton = {
    ...menuOptions,
    label: 'value: ' + (tags.reactionValue ?? ""),
    simAction_menuSortOrder: 10,
    onClick: `@
        const response = await os.showInput(links.reaction.tags.reactionValue, {
            autoSelect: true,
            title: 'What value should the stat be effected by?',
        });
        links.reaction.tags.reactionValue = response;
        links.reaction.onClick();
    `
}

const triggerFilterButton = {
    ...menuOptions,
    label: 'add to trigger filter',
    simAction_menuSortOrder: 6,
    formAddress: 'add',
    onClick: `@
        links.reaction.tags.choosingTrigger = true;
        links.reaction.tags.choosingTriggerFilter = true;
        shout("clearSimActionMenu");
    `
}

ab.links.menu.abCreateMenuButton(labelButton);
ab.links.menu.abCreateMenuButton(storyButton);
ab.links.menu.abCreateMenuButton(triggerButton);
ab.links.menu.abCreateMenuButton(addRoleTagButton);
ab.links.menu.abCreateMenuButton(attributeButton);
ab.links.menu.abCreateMenuDropdown(effectButton);
ab.links.menu.abCreateMenuButton(valueButton);
ab.links.menu.abCreateMenuButton(triggerFilterButton);