if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

const triggerBot = getBot("choosingTrigger", true);
const hideTriggerBot = getBot("choosingHideTrigger", true);
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

if (hideTriggerBot) {
    hideTriggerBot.addHideTrigger(thisBot);
    tags.color = tags.prevColor;
    tags.prevColor = null;
    return;
}

if (completionTriggerBot) {
    completionTriggerBot.addCompletionTrigger(thisBot);
    tags.color = tags.prevColor;
    tags.prevColor = null;
    return;
}

if (tags.choosingProp) {
    tags.choosingProp = false;
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

const typeButton = {
    ...menuOptions,
    label: 'type: ' + tags.propReactionType,
    simAction_menuSortOrder: 1,
    dropdownSortOrder: 1,
    dropdownOptions: [
        {
            ...menuOptions,
            label: 'onClick',
            onClick: `@
                links.reaction.tags.propReactionType = 'onClick';
                links.reaction.tags.label = 'onClick';
                links.reaction.onClick();
            `
        },
        {
            ...menuOptions,
            label: 'onDrag',
            onClick: `@
                links.reaction.tags.propReactionType = 'onDrag';
                links.reaction.tags.label = 'onDrag';
                links.reaction.onClick();
            `
        }
    ]
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
    label: 'set prop',
    formAddress: 'add',
    simAction_menuSortOrder: 5,
    onClick: `@
        links.reaction.tags.choosingProp = true;
        shout("clearSimActionMenu");
    `
}

ab.links.menu.abCreateMenuDropdown(typeButton);
ab.links.menu.abCreateMenuButton(storyButton);
ab.links.menu.abCreateMenuButton(triggerButton);
ab.links.menu.abCreateMenuButton(addRoleTagButton);