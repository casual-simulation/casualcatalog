configBot.masks.menuPortal = 'abPatchTodoBudgetMenu';

ab.links.menu.abCreateMenuInput({
    abPatchTodoBudgetMenu: true,
    abPatchTodoBudgetMenuSortOrder: 1,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    label: 'budget (credits)',
    formAddress: 'savings',
    patchBot: getLink(thisBot),
    onCreate: ListenerString(() => {
        masks.menuItemText = String(links.patchBot.tags.budgetCredits ?? '');
    }),
    onABPatchBudgetInput: ListenerString(() => {
        const parsed = Number(that);
        if (!isNaN(parsed) && isFinite(parsed) && parsed > 0) {
            links.patchBot.tags.budgetCredits = parsed;
        }
    }),
    onInputTyping: ListenerString(() => {
        whisper(thisBot, 'onABPatchBudgetInput', that.text);
    }),
    onSubmit: ListenerString(() => {
        whisper(thisBot, 'onABPatchBudgetInput', that.text);
    }),
});

ab.links.menu.abCreateMenuButton({
    abPatchTodoBudgetMenu: true,
    abPatchTodoBudgetMenuSortOrder: 2,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    label: 'done',
    formAddress: 'done',
    patchBot: getLink(thisBot),
    onClick: ListenerString(() => {
        whisper(links.patchBot, 'abPatchTodoMenuOpen');
    }),
});
