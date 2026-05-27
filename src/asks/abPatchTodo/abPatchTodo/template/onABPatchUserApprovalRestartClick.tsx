shout('abPatchTodoMenuReset');

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] approval-restart clicked on ${thisBot.id} (approvalForPlanId=${tags.todoApprovalForPlanId})`);
}

const chain = thisBot.abCollectApprovalChain();
if (!chain || chain.plans.length === 0) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] no chain found — destroying self`);
    }
    destroy(thisBot);
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] chain spans ${chain.plans.length} plan(s) — topmost=${chain.topmostTodo?.id}`);
}

const topmost = chain.topmostTodo;

// Undo applied patches in reverse order across the whole chain. Skip the topmost since
// abTodoResetState below will run abPatchUndo on it and double-undo would corrupt rollback.
for (const plan of chain.plans) {
    const appliedTodos = plan.todos
        .filter(b => b.tags.abPatchApplied && (!topmost || b.id !== topmost.id))
        .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0));
    for (const todo of appliedTodos) {
        whisper(todo, 'abPatchUndo');
    }
}

const toDestroy = chain.allTodos.filter(b => !topmost || b.id !== topmost.id);
destroy(toDestroy);

// Also destroy sibling approval todos targeting plans in this chain (excluding self;
// thisBot is destroyed at the end).
const chainPlanIds = chain.plans.map(p => p.planId);
const ancestorApprovals = getBots(b =>
    b.tags.isUserApprovalTodo &&
    chainPlanIds.includes(b.tags.todoApprovalForPlanId) &&
    b.id !== thisBot.id
);
destroy(ancestorApprovals);

if (topmost) {
    whisper(topmost, 'abTodoResetState');
    setTag(topmost, 'todoReadyForAgent', true);
}

const username = await ab.links.console.getUserName();
ab.links.utils.abLog({
    message: `Todo plan restarted by ${username}. Reset original request todo${topmost ? ` (${topmost.id})` : ''}.`,
    space: 'shared',
});

destroy(thisBot);
