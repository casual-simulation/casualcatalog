const animTransitions = {
    'incomplete_in': 'incomplete_static',
    'incomplete_out': 'processing_in',
    'processing_in': 'processing_loop',
    'processing_out': tags.nextAnimation,
    'error_in': 'error_static',
    'error_out': 'blank',
    'complete_in': 'complete_static',
    'complete_out': 'blank',
};

const next = animTransitions[tags.currAnimation];

if (next) {
    thisBot.changeAnimationState(next);
}

// After the last approved todo transitions to complete_static, destroy all todos in the plan
if (tags.currAnimation === 'complete_in' && tags.lastPlanTodoApproved && tags.todoPlanId) {
    const planTodos = getBots(b =>
        b.tags.abPatchTodoInstance &&
        b.tags.todoPlanId === tags.todoPlanId
    );
    for (const todo of planTodos) {
        destroy(todo);
    }
}
