// Need to reimplement undo all functionaltiy, its much more complex now that todo bots could be part of a larger plan.
// We should only undo all todos in a plan. If the user wants to undo all plans they need to go through all the plans.
// When undoing all todos in a plan it should also respect the todo's order in the plan — undoing them in reverse order.
// Shouting is probably not the solution here but instead whispering to each todo bot in the plan.
console.warn('TODO: need to reimplement undo all functionality functionality. defaulting to old naive behavior.');

if (tags.abPatchApplied && tags.abPatchTodoInstance) {
    const abAppliedPatchBots = thisBot.abGetAppliedPatchBots();
    
    for (const abPatchBot of abAppliedPatchBots) {
        whisper(abPatchBot, 'onABPatchUndoClick');
    }
}