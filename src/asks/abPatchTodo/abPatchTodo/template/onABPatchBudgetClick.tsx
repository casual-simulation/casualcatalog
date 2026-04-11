configBot.masks.menuPortal = 'abPatchTodoBudgetMenu';

ab.links.menu.abCreateMenuInput({
    abPatchTodoBudgetMenu: true,
    abPatchTodoBudgetMenuSortOrder: 1,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    label: 'budget (credits)',
    formAddress: 'savings',
    patchBot: getLink(thisBot),
    onCreate: ListenerString(() => {
        const initial = links.patchBot.tags.budgetCredits;
        masks.menuItemText = initial != null ? Number(initial).toLocaleString() : '';
    }),
    onABPatchBudgetInput: ListenerString(() => {
        const parsed = parseInt(String(that).replace(/,/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) {
            links.patchBot.tags.budgetCredits = parsed;
        } else {
            os.toast('budget must be a positive number');
        }
    }),
    onInputTyping: ListenerString(() => {
        const stripped = String(that.text).replace(/,/g, '');
        const parsed = parseInt(stripped, 10);
        if (!isNaN(parsed) && String(parsed) === stripped) {
            masks.menuItemText = parsed.toLocaleString();
        }
    }),
    onSubmit: ListenerString(() => {
        whisper(thisBot, 'onABPatchBudgetInput', that.text);
        whisper(links.patchBot, 'abPatchTodoMenuOpen');
    }),
});
