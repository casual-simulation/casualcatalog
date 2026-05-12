let desiredTodoForm;

if (tags.isUserAskTodo) {
    desiredTodoForm = 'plan';
} else if (tags.agentMode === 'build') {
    desiredTodoForm = 'build';
} else if (tags.agentMode === 'plan') {
    desiredTodoForm = 'plan';
} else {
    desiredTodoForm = 'build';
}

if (!tags.todoFormConfigs[desiredTodoForm]) {
    // Fallback to 'build' form if current desired form doesn't have a config.
    desiredTodoForm = 'build';
}

if (tags.todoForm === desiredTodoForm) {
    return;
}

masks.todoForm = desiredTodoForm;

const config = tags.todoFormConfigs[desiredTodoForm];
const targetFormAddress = ab.abBuildCasualCatalogURL(config.meshPath);

if (masks.form !== 'mesh') {
    masks.form = 'mesh';
}

if (masks.formAddress !== targetFormAddress) {
    masks.formAddress = targetFormAddress;

    masks.formAddressAnimations = null; // Clear cached animations while loading new form.
    masks.formAddressAnimations = await os.listFormAnimations(thisBot);
}

thisBot.refreshAnimation();