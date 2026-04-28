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

masks.menuOpen = true;

const planTodos  = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);
const allCompleted = planTodos.every(b => b.tags.abTodoComplete);
const anyFailed  = planTodos.some(b => b.tags.abPatchError);
const anyReady   = planTodos.some(b => b.tags.todoReadyForAgent);
const isApproved = !!tags.todoApproved;
const notStarted = !anyReady && !allCompleted && !anyFailed;
const isBusy     = anyReady && !allCompleted && !anyFailed;

const menuOptions = {
    abPatchTodoMenu: true,
    abPatchTodoMenuSortOrder: 0,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(thisBot),
    groupSortOrder: 100,
    menuItems: [],
};

// Always: prompt label
menuOptions.menuItems.push({
    label: tags.todoLabel ?? tags.prompt ?? '',
    menuItemType: 'button',
    formAddress: 'notes',
    menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    menuItemLabelStyle: { 'font-style': 'italic' },
    onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchPromptClick'); }),
});

// Always: ai agent
menuOptions.menuItems.push({
    label: `ai agent: ${tags.agentName ?? tags.aiModel ?? 'default'}`,
    formAddress: 'lightbulb',
    ...(isApproved ? {} : { onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchAIModelClick'); }) }),
});

if (globalThis.abXPE) {
    // Always: budget
    menuOptions.menuItems.push({
        label: `budget: ${tags.budgetCredits != null ? Number(tags.budgetCredits).toLocaleString() + ' credits' : 'not set'}`,
        formAddress: 'savings',
        ...(isApproved ? {} : { onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchBudgetClick'); }) }),
    });
    
    // Always: budget studio
    const budgetStudioLabel = (() => {
        if (!tags.budgetRecordName || tags.budgetRecordName === authBot.id) return 'your account';
        const studios = configBot.tags.user_studios?.studios;
        const studio = studios?.find(s => s.studioId === tags.budgetRecordName);
        return studio?.displayName ?? tags.budgetRecordName;
    })();
    menuOptions.menuItems.push({
        label: `budget studio: ${budgetStudioLabel}`,
        formAddress: 'payment',
        ...(isApproved ? {} : { onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchBudgetStudioClick'); }) }),
    });
}


// Always: cost for this todo (if completed)
if (tags.creditSnapshotStart != null && tags.creditSnapshotEnd != null) {
    const cost = tags.creditSnapshotStart - tags.creditSnapshotEnd;
    menuOptions.menuItems.push({
        label: `cost: ${Math.round(cost).toLocaleString()} credits`,
        menuItemType: 'text',
        formAddress: 'receipt',
        menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    });
}

if (isApproved) {
    // no action buttons — approved todos are read-only receipts
} else if (notStarted) {
    menuOptions.menuItems.push({
        label: 'assign agents',
        formAddress: 'slideshow',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onAssignAgentsClick'); }),
    });
    menuOptions.menuItems.push({
        label: 'undo plan',
        formAddress: 'undo',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUndoClick'); }),
    });
} else if (isBusy) {
    ab.links.menu.abCreateMenuBusyIndicator({
        abPatchTodoMenu: true,
        abPatchTodoMenuReset: `@destroy(thisBot)`,
        abPatchTodoMenuSortOrder: 999,
        label: 'agents working',
    });
    menuOptions.menuItems.push({
        label: 'undo plan',
        formAddress: 'undo',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUndoClick'); }),
    });
} else if (allCompleted) {
    menuOptions.menuItems.push({
        label: 'approve plan',
        formAddress: 'done',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchApproveClick'); }),
    });
    menuOptions.menuItems.push({
        label: 'undo plan',
        formAddress: 'undo',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUndoClick'); }),
    });
    menuOptions.menuItems.push({
        label: 'restart plan',
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
        label: 'undo plan',
        formAddress: 'undo',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUndoClick'); }),
    });
    menuOptions.menuItems.push({
        label: 'try again',
        formAddress: 'replay',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchTryAgainClick'); }),
    });
}

ab.links.menu.abCreateMenuGroup(menuOptions);
