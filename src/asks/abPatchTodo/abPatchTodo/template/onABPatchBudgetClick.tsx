const result = await os.showInput(tags.budgetCredits, {
    title: 'Set Budget',
    placeholder: 'Enter credit amount',
});

if (result == null) return;

const parsed = Number(result);
if (isNaN(parsed) || !isFinite(parsed)) {
    os.toast('Please enter a valid number.');
    return;
}

if (parsed <= 0) {
    os.toast('Budget must be greater than 0.');
    return;
}

tags.budgetCredits = parsed;
whisper(thisBot, 'abPatchTodoMenuOpen');
