if (tags.abPatchApplied && tags.abPatchTodoInstance) {
    shout('onABPatchApprove', {
        botId: thisBot.id,
        abPatchBotIdentity: tags.abPatchBotIdentity,
        abPatchAskInput: tags.abPatchAskInput,
        abPatchCode: tags.abPatchCode,
        abPatchAppliedTimestamp: tags.abPatchAppliedTimestamp,
        abPatchResults: tags.abPatchResults,
    });

    tags.abPatchApproved = true;
    tags.lastPlanTodoApproved = false;

    // Check if all todos in this plan are now approved
    if (tags.todoPlanId) {
        const planTodos = getBots(b =>
            b.tags.abPatchTodoInstance &&
            b.tags.todoPlanId === tags.todoPlanId
        );
        const allApproved = planTodos.every(b => b.tags.abPatchApproved);

        if (allApproved) {
            // Mark this as the last todo — onFormAnimationFinished will handle cleanup
            tags.lastPlanTodoApproved = true;
        }
    }

    thisBot.changeAnimationState("complete_in");
}
