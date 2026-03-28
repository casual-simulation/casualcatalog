shout('abPatchTodoMenuReset');
configBot.masks.menuPortal = 'abPatchTodoMenu';

// Cleanup bot — resets menu if this todo bot is destroyed
create({
    space: 'tempLocal',
    patchBotId: thisBot.id,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    onBotAdded: `@
        const patchBot = getBot('id', tags.patchBotId);
        if (!patchBot) { shout('abPatchTodoMenuReset'); }
    `,
    onAnyBotsRemoved: `@
        if (that.botIDs.includes(tags.patchBotId)) { shout('abPatchTodoMenuReset'); }
    `,
});

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);
const allApplied = planTodos.every(b => b.tags.abPatchApplied);
const anyFailed  = planTodos.some(b => b.tags.abPatchError);
const isBusy     = !allApplied && !anyFailed;

const menuOptions = {
    abPatchTodoMenu: true,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(thisBot),
    groupSortOrder: 100,
    color: tags.abPatchColor,
    menuItems: [],
};

// Always: prompt label
menuOptions.menuItems.push({
    label: tags.todoLabel ?? tags.prompt ?? '',
    menuItemType: 'text',
    formAddress: 'notes',
    menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    menuItemLabelStyle: { 'font-style': 'italic' },
});

if (isBusy) {
    ab.links.menu.abCreateMenuBusyIndicator({
        abPatchTodoMenu: true,
        abPatchTodoMenuReset: `@destroy(thisBot)`,
        abPatchTodoMenuSortOrder: 100.02,
        label: 'being worked on',
    });
} else if (allApplied) {
    menuOptions.menuItems.push({
        label: 'approve',
        formAddress: 'done',
        onClick: `@whisper(links.patchBot, 'onABPatchApproveClick');`,
    });
    menuOptions.menuItems.push({
        label: 'undo',
        formAddress: 'undo',
        onClick: `@whisper(links.patchBot, 'onABPatchUndoClick');`,
    });
    menuOptions.menuItems.push({
        label: 'restart',
        formAddress: 'replay',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchRestartClick'); }),
    });
} else if (anyFailed) {
    const failedTodo = planTodos.find(b => b.tags.abPatchError);
    menuOptions.menuItems.push({
        label: failedTodo?.tags.abPatchError ?? 'error',
        menuItemType: 'text',
        formAddress: 'error',
        color: 'firebrick',
        labelColor: 'white',
        menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    });
    menuOptions.menuItems.push({
        label: 'undo',
        formAddress: 'undo',
        onClick: `@whisper(links.patchBot, 'onABPatchUndoClick');`,
    });
    menuOptions.menuItems.push({
        label: 'try again',
        formAddress: 'replay',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchTryAgainClick'); }),
    });
}

ab.links.menu.abCreateMenuGroup(menuOptions);
