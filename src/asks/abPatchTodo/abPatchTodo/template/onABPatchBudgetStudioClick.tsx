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
    label: `${!tags.budgetRecordName || tags.budgetRecordName === authBot.id ? '✓ ' : ''}your account`,
    formAddress: 'person',
    patchBot: getLink(thisBot),
    onClick: ListenerString(() => {
        links.patchBot.tags.budgetRecordName = authBot.id;
        whisper(links.patchBot, 'abPatchTodoMenuOpen');
    }),
});

// Inst studio option (if applicable).
if (ownerStudio) {
    ab.links.menu.abCreateMenuButton({
        abPatchTodoBudgetStudioMenu: true,
        abPatchTodoBudgetStudioMenuSortOrder: 2,
        abPatchTodoMenuReset: `@destroy(thisBot)`,
        label: `${tags.budgetRecordName === ownerStudio.studioId ? '✓ ' : ''}${ownerStudio.displayName}`,
        formAddress: 'group',
        patchBot: getLink(thisBot),
        studioId: ownerStudio.studioId,
        onClick: ListenerString(() => {
            links.patchBot.tags.budgetRecordName = tags.studioId;
            whisper(links.patchBot, 'abPatchTodoMenuOpen');
        }),
    });
}
