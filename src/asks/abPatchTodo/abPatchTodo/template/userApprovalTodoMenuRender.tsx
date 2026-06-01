// Generation token set by abPatchTodoMenuOpen — see the comment there. Stamp our bots with it
// and drop them at the end if a newer render has superseded us.
const renderToken = masks.menuRenderToken;

const menuOptions: any = {
    abPatchTodoMenu: true,
    abPatchTodoMenuSortOrder: 0,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    menuRenderToken: renderToken,
    patchBot: getLink(thisBot),
    groupSortOrder: 100,
    menuItems: [],
};

menuOptions.menuItems.push({
    label: tags.todoLabel ?? tags.prompt ?? 'Review plan',
    menuItemType: 'button',
    formAddress: 'verified',
    menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    menuItemLabelStyle: { 'font-style': 'italic' },
});

if (tags.todoApproved) {
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
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUserApprovalApproveClick'); }),
    });

    menuOptions.menuItems.push({
        label: 'undo',
        formAddress: 'undo',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUserApprovalUndoClick'); }),
    });

    menuOptions.menuItems.push({
        label: 'restart',
        formAddress: 'replay',
        onClick: ListenerString(() => { whisper(links.patchBot, 'onABPatchUserApprovalRestartClick'); }),
    });
}

await ab.links.menu.abCreateMenuGroup(menuOptions);

if (masks.menuRenderToken !== renderToken) {
    destroy(getBots('menuRenderToken', renderToken));
}
