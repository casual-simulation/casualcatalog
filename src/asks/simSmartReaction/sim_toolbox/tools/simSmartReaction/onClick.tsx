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

const orderMattersButton = {
    ...menuOptions,
    label: 'order matters',
    formAddress: tags.orderMatters ? 'check_box' : 'check_box_outline_blank',
    simAction_menuSortOrder: 7,
    onClick: `@
        links.reaction.tags.orderMatters = !links.reaction.tags.orderMatters;
        links.reaction.onClick();
    `
}

const sequentialButton = {
     ...menuOptions,
    label: 'sequential',
    formAddress: tags.sequentialMatters ? 'check_box' : 'check_box_outline_blank',
    simAction_menuSortOrder: 7,
    onClick: `@
        links.reaction.tags.sequentialMatters = !links.reaction.tags.sequentialMatters;
        links.reaction.onClick();
    `
}

const actionQueueorLogButton = {
     ...menuOptions,
    label: 'check queue or log: ' + (tags.checkQueue ? 'queue' : 'log'),
    formAddress: 'compare_arrows',
    simAction_menuSortOrder: 7,
    onClick: `@
        links.reaction.tags.checkQueue = !links.reaction.tags.checkQueue;
        links.reaction.onClick();
    `
}

const manualButton = {
    ...menuOptions,
    label: 'set manual function',
    formAddress: 'add',
    simAction_menuSortOrder: 7,
    onClick: `@
        configBot.tags.tagPortal = getID(links.reaction) + ".manualFunction"
    `
}

ab.links.menu.abCreateMenuButton(labelButton);
ab.links.menu.abCreateMenuButton(storyButton);
ab.links.menu.abCreateMenuButton(triggerButton);
ab.links.menu.abCreateMenuButton(addRoleTagButton);
ab.links.menu.abCreateMenuButton(orderMattersButton);
ab.links.menu.abCreateMenuButton(sequentialButton);
ab.links.menu.abCreateMenuButton(actionQueueorLogButton);
ab.links.menu.abCreateMenuButton(manualButton);
