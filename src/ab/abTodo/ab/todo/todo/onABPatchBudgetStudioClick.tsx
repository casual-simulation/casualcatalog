const todoBot = that;

configBot.masks.menuPortal = 'abPatchTodoBudgetStudioMenu';

let ownerStudio = null;
if (ab.links.utils.isInstOwnedByStudio()) {
    if (!configBot.tags.user_studios) {
        await ab.abRefreshStudios();
    }
    if (configBot.tags.user_studios?.success) {
        const userStudios = configBot.tags.user_studios.studios;
        ownerStudio = userStudios.find(s => s.studioId === configBot.tags.owner) ?? null;
    }
}

// "Your account" option.
ab.links.menu.abCreateMenuButton({
    abPatchTodoBudgetStudioMenu: true,
    abPatchTodoBudgetStudioMenuSortOrder: 1,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    label: `${!todoBot.tags.budgetRecordName || todoBot.tags.budgetRecordName === authBot.id ? '✓ ' : ''}your account`,
    formAddress: 'person',
    patchBot: getLink(todoBot),
    onClick: ListenerString(() => {
        links.patchBot.tags.budgetRecordName = authBot.id;
        ab.links.todo.abPatchTodoMenuOpen(links.patchBot);
    }),
});

// Inst studio option (if applicable).
if (ownerStudio) {
    ab.links.menu.abCreateMenuButton({
        abPatchTodoBudgetStudioMenu: true,
        abPatchTodoBudgetStudioMenuSortOrder: 2,
        abPatchTodoMenuReset: `@destroy(thisBot)`,
        label: `${todoBot.tags.budgetRecordName === ownerStudio.studioId ? '✓ ' : ''}${ownerStudio.displayName}`,
        formAddress: 'group',
        patchBot: getLink(todoBot),
        studioId: ownerStudio.studioId,
        onClick: ListenerString(() => {
            links.patchBot.tags.budgetRecordName = tags.studioId;
            ab.links.todo.abPatchTodoMenuOpen(links.patchBot);
        }),
    });
}
