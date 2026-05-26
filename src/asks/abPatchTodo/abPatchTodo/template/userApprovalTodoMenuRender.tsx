const menuOptions: any = {
    abPatchTodoMenu: true,
    abPatchTodoMenuSortOrder: 0,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
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

ab.links.menu.abCreateMenuGroup(menuOptions);
