const todoBot = that;

// Generation token for this render. Renders overlap (the todo's onBotChanged auto-retriggers
// this on tag changes, and several click/lifecycle listeners whisper it too), so build-then-keep
// is not atomic. Every bot this render creates is stamped with renderToken; if a newer render
// supersedes us while we're awaiting bot creation, we drop our own bots at the end instead of
// leaving duplicates behind. masks.menuRenderToken (on this controller) always holds the latest
// render's token — the controller is a singleton and only one todo menu is open at a time.
const renderToken = uuid();
masks.menuRenderToken = renderToken;

shout('abPatchTodoMenuReset');
configBot.masks.menuPortal = 'abPatchTodoMenu';

// Cleanup bot — resets menu if this todo bot is destroyed
create({
    space: 'tempLocal',
    patchBotId: todoBot.id,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    onBotAdded: `@
        const patchBot = getBot('id', tags.patchBotId);
        if (!patchBot) { shout('abPatchTodoMenuReset'); }
    `,
    onAnyBotsRemoved: `@
        if (that.botIDs.includes(tags.patchBotId)) { shout('abPatchTodoMenuReset'); }
    `,
});

setTagMask(todoBot, 'menuOpen', true, 'tempLocal');

// User-ask question todos render a distinct menu (question + answer UI). The standard plan
// menu below doesn't apply — return early after rendering.
if (todoBot.tags.isUserAskTodo) {
    await thisBot.userAskTodoMenuRender(todoBot);
    return;
}

// User-approval todos render approve / undo / restart buttons that act on the entire
// related plan chain. Return early — the standard plan menu doesn't apply.
if (todoBot.tags.isUserApprovalTodo) {
    await thisBot.userApprovalTodoMenuRender(todoBot);
    return;
}

const planTodos  = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === todoBot.tags.todoPlanId);
const allCompleted = planTodos.every(b => b.tags.abTodoComplete);
const anyFailed  = planTodos.some(b => b.tags.abPatchError);
const anyReady   = planTodos.some(b => b.tags.todoReadyForAgent);
const isApproved = !!todoBot.tags.todoApproved;
const notStarted = !anyReady && !allCompleted && !anyFailed;
const isBusy     = anyReady && !allCompleted && !anyFailed;

const menuOptions = {
    abPatchTodoMenu: true,
    abPatchTodoMenuSortOrder: 0,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    menuRenderToken: renderToken,
    patchBot: getLink(todoBot),
    groupSortOrder: 100,
    menuItems: [],
};

// Always: prompt label
menuOptions.menuItems.push({
    label: todoBot.tags.todoLabel ?? todoBot.tags.prompt ?? '',
    menuItemType: 'button',
    formAddress: 'notes',
    menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    menuItemLabelStyle: { 'font-style': 'italic' },
    onClick: ListenerString(() => { ab.links.todo.onABPatchPromptClick(links.patchBot); }),
});

// Owner attribution — sits directly under the prompt label
if (todoBot.tags.ownerDisplayName) {
    menuOptions.menuItems.push({
        label: todoBot.tags.ownerDisplayName,
        menuItemType: 'text',
        formAddress: 'person',
        menuItemStyle: { 'padding-top': '2px', 'padding-bottom': '2px' },
    });
}

// Attachments (read-only) — only shown when the todo has attachments
const todoAttachments: ABAttachment[] = todoBot.tags.attachments ?? [];
if (todoAttachments.length > 0) {
    menuOptions.menuItems.push({
        label: `attachments (${todoAttachments.length})`,
        menuItemType: 'dropdown',
        formAddress: 'attach_file',
        dropdownOptions: todoAttachments.map((att: ABAttachment) => {
            const icon = att.mimeType?.startsWith('image/') ? 'image' : 'insert_drive_file';
            return { label: att.name, formAddress: icon };
        }),
    });
}

// Always: ai agent
menuOptions.menuItems.push({
    label: `ai agent: ${todoBot.tags.agentName ?? todoBot.tags.aiModel ?? 'default'}`,
    formAddress: 'lightbulb',
    ...(isApproved ? {} : { onClick: ListenerString(() => { ab.links.todo.onABPatchAIModelClick(links.patchBot); }) }),
});

if (globalThis.abXPE) {
    // Always: budget
    menuOptions.menuItems.push({
        label: `budget: ${todoBot.tags.budgetCredits != null ? Number(todoBot.tags.budgetCredits).toLocaleString() + ' credits' : 'not set'}`,
        formAddress: 'savings',
        ...(isApproved ? {} : { onClick: ListenerString(() => { ab.links.todo.onABPatchBudgetClick(links.patchBot); }) }),
    });

    // Always: budget studio
    const budgetStudioLabel = (() => {
        if (!todoBot.tags.budgetRecordName || todoBot.tags.budgetRecordName === authBot.id) return 'your account';
        const studios = configBot.tags.user_studios?.studios;
        const studio = studios?.find(s => s.studioId === todoBot.tags.budgetRecordName);
        return studio?.displayName ?? todoBot.tags.budgetRecordName;
    })();
    menuOptions.menuItems.push({
        label: `budget studio: ${budgetStudioLabel}`,
        formAddress: 'payment',
        ...(isApproved ? {} : { onClick: ListenerString(() => { ab.links.todo.onABPatchBudgetStudioClick(links.patchBot); }) }),
    });
}


// Always: cost for this todo (if completed)
if (todoBot.tags.creditSnapshotStart != null && todoBot.tags.creditSnapshotEnd != null) {
    const cost = todoBot.tags.creditSnapshotStart - todoBot.tags.creditSnapshotEnd;
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
        label: 'begin plan',
        formAddress: 'play_circle',
        onClick: ListenerString(() => { ab.links.todo.onAssignAgentsClick(links.patchBot); }),
    });
    menuOptions.menuItems.push({
        label: 'cancel plan',
        formAddress: 'cancel',
        onClick: ListenerString(() => { ab.links.todo.onABPatchUndoClick(links.patchBot); }),
    });
} else if (isBusy) {
    await ab.links.menu.abCreateMenuBusyIndicator({
        abPatchTodoMenu: true,
        abPatchTodoMenuReset: `@destroy(thisBot)`,
        abPatchTodoMenuSortOrder: 999,
        menuRenderToken: renderToken,
        label: 'agents working',
    });
    menuOptions.menuItems.push({
        label: 'cancel plan',
        formAddress: 'cancel',
        onClick: ListenerString(() => { ab.links.todo.onABPatchUndoClick(links.patchBot); }),
    });
} else if (allCompleted) {
    // Plan-level actions (approve / undo / restart) live on the dedicated user-approval todo
    // spawned next to the last plan todo — see spawnUserApprovalTodo.
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
        label: 'cancel plan',
        formAddress: 'cancel',
        onClick: ListenerString(() => { ab.links.todo.onABPatchUndoClick(links.patchBot); }),
    });
    menuOptions.menuItems.push({
        label: 'try again',
        formAddress: 'replay',
        onClick: ListenerString(() => { ab.links.todo.onABPatchTryAgainClick(links.patchBot); }),
    });
}

await ab.links.menu.abCreateMenuGroup(menuOptions);

// If a newer render superseded this one while we were awaiting bot creation, drop the bots we
// created so the latest render's menu is the only one left standing.
if (masks.menuRenderToken !== renderToken) {
    destroy(getBots('menuRenderToken', renderToken));
}
