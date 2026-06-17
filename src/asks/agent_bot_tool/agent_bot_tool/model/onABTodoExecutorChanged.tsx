// Shouted inst-wide whenever any user's executor changes (e.g. a tab takeover/reload).
// Only react for agents the local user owns,
if (tags.ownerId && tags.ownerId !== authBot?.id) {
    return;
}

if (tags.todoInProgress) {
    tags.todoInProgress = null;
}

tags.agentArm = null;