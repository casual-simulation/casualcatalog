let todoBot;

if (typeof that === 'string') {
    todoBot = getBot('id', that);
} else {
    todoBot = that;   
}

if (!ab.links.utils.isBot(todoBot) || !todoBot.tags.abPatchTodoInstance) {
    console.error(`[${tags.system}.${tagName}] could not assign todo to agent bot.`, that);
    return;
}

tags.todoBot = getLink(todoBot);
tags.todoInProgress = null;
tags.agentArm = null;