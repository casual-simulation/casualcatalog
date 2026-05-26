shout('abPatchTodoMenuReset');

const chain = thisBot.abCollectApprovalChain();
if (!chain || chain.plans.length === 0) {
    destroy(thisBot);
    return;
}

const allTodos = thisBot.abExpandToDescendantTodos({ todos: chain.allTodos });

// Undo applied patches across the whole chain, processing each plan in reverse todoOrder.
for (const plan of chain.plans) {
    const appliedTodos = plan.todos
        .filter(b => b.tags.abPatchApplied)
        .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0));
    for (const todo of appliedTodos) {
        whisper(todo, 'abPatchUndo');
    }
}

// Also destroy any sibling approval todos that target plans in this chain (e.g. an
// approval that lives next to an ancestor plan), so we don't leave dangling prompts.
const chainPlanIds = chain.plans.map(p => p.planId);
const ancestorApprovals = getBots(b =>
    b.tags.isUserApprovalTodo &&
    chainPlanIds.includes(b.tags.todoApprovalForPlanId) &&
    b.id !== thisBot.id
);

// Clear awaitingUserResponse on parent agent todos so cascading user-ask onDestroy handlers
// treat this as a deliberate undo rather than the user abandoning a clarification.
for (const todo of allTodos) {
    if (todo.tags.awaitingUserResponse === true) {
        setTag(todo, 'awaitingUserResponse', null);
    }
}

destroy(allTodos);
destroy(ancestorApprovals);

const username = await ab.links.console.getUserName();
const planIds = chain.plans.map(p => p.planId).join(', ');
ab.links.utils.abLog({
    message: `Todo plan(s) ${planIds} have been cancelled by ${username}.`,
    space: 'shared',
});

destroy(thisBot);
