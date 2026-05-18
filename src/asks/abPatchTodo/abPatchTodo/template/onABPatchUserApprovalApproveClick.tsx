shout('abPatchTodoMenuReset');

const chain = thisBot.abCollectApprovalChain();
if (!chain || chain.plans.length === 0) {
    destroy(thisBot);
    return;
}

for (const todo of chain.allTodos) {
    shout('onAnyABPatchApprove', { botId: todo.id });

    setTag(todo, 'todoApproved', true);

    // Remove from previous dimension.
    const prevDim = todo.tags.dimension;
    const prevDimPos = prevDim ? getBotPosition(todo, prevDim) : new Vector(0, 0, 0);

    if (prevDim) {
        todo.tags[prevDim] = false;
        todo.tags[prevDim + 'X'] = null;
        todo.tags[prevDim + 'Y'] = null;
        todo.tags[prevDim + 'Z'] = null;
    }

    todo.tags.dimension = 'log';
    todo.tags['log'] = true;
    todo.tags['logX'] = prevDimPos.x;
    todo.tags['logY'] = prevDimPos.y;
    todo.tags['logZ'] = prevDimPos.z;
}

const username = await ab.links.console.getUserName();
const planIds = chain.plans.map(p => p.planId).join(', ');
ab.links.utils.abLog({
    message: `Todo plan(s) ${planIds} have been approved by ${username}. Moved todo bots to the "log" dimension.`,
    space: 'shared',
});

// Destroy any sibling approval todos targeting plans in this chain (e.g. an ancestor's
// approval prompt left over from a plan-mode userRequestTodo completion).
const chainPlanIds = chain.plans.map(p => p.planId);
const ancestorApprovals = getBots(b =>
    b.tags.isUserApprovalTodo &&
    chainPlanIds.includes(b.tags.todoApprovalForPlanId) &&
    b.id !== thisBot.id
);
destroy(ancestorApprovals);

if (ab.links.manifestation.tags.abAwake) {
    const approvalDim = tags.dimension;
    const approvalPos = {
        x: tags[approvalDim + 'X'] ?? 0,
        y: tags[approvalDim + 'Y'] ?? 0,
    };

    await ab.links.manifestation.abManifestBot({ dimension: approvalDim, position: approvalPos });
    ab.links.manifestation.abClick();
}

destroy(thisBot);
