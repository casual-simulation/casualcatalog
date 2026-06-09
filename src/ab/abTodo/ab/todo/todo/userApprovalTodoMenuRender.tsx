const todoBot = that;

// Generation token set by abPatchTodoMenuOpen — see the comment there. Lives on this controller
// (masks.menuRenderToken). Stamp our bots with it and drop them at the end if a newer render has
// superseded us.
const renderToken = masks.menuRenderToken;

const menuOptions: any = {
    abPatchTodoMenu: true,
    abPatchTodoMenuSortOrder: 0,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    menuRenderToken: renderToken,
    patchBot: getLink(todoBot),
    groupSortOrder: 100,
    menuItems: [],
};

menuOptions.menuItems.push({
    label: todoBot.tags.todoLabel ?? todoBot.tags.prompt ?? 'Review plan',
    menuItemType: 'button',
    formAddress: 'verified',
    menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    menuItemLabelStyle: { 'font-style': 'italic' },
});

if (todoBot.tags.todoApproved) {
    // Archived approval — show the outcome only, no action buttons.
    menuOptions.menuItems.push({
        label: 'approved',
        menuItemType: 'text',
        formAddress: 'check_circle',
        menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    });
} else {
    menuOptions.menuItems.push({
        label: 'approve',
        formAddress: 'done',
        onClick: ListenerString(() => { ab.links.todo.onABPatchUserApprovalApproveClick(links.patchBot); }),
    });

    menuOptions.menuItems.push({
        label: 'undo',
        formAddress: 'undo',
        onClick: ListenerString(() => { ab.links.todo.onABPatchUserApprovalUndoClick(links.patchBot); }),
    });

    menuOptions.menuItems.push({
        label: 'restart',
        formAddress: 'replay',
        onClick: ListenerString(() => { ab.links.todo.onABPatchUserApprovalRestartClick(links.patchBot); }),
    });
}

await ab.links.menu.abCreateMenuGroup(menuOptions);

if (masks.menuRenderToken !== renderToken) {
    destroy(getBots('menuRenderToken', renderToken));
}
