const todoBotId = that?.args?.todoBotId;

if (!todoBotId) {
    return;
}

const todoBot = getBot('id', todoBotId);

if (!todoBot) {
    return;
}

todoBot.tags.abTodoComplete = true;
todoBot.tags.animationState = 'complete';
