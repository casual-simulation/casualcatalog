// Need to reimplement approve all functionaltiy, its much more complex now that todo bots could be part of a larger plan.
// We should only approve all todos in a plan. If the user wants to approve all plans they need to go through all the plans.
// When approving all todos in a plan it should also respect the todo's order in the plan. 
// Shouting is probably not the solution here but instead whispering to each todo bot in the plan.
console.warn('TODO: need to reimplement approve all functionality functionality. defaulting to old naive behavior.');

if (tags.abPatchTodoInstance) {
    shout('onABPatchApproveClick');
}