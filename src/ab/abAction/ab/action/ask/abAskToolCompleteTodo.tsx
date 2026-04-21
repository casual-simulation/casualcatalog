const todoBot = that?.askContext?.todoBot;

if (!todoBot) {
    return;
}

todoBot.tags.abTodoComplete = true;
todoBot.tags.animationState = 'complete';
