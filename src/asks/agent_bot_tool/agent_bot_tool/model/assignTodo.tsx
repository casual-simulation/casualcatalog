const taskBot = getBot(byID(that));
if (!taskBot || !taskBot.tags.abPatchTodoInstance) {
    console.log("Could not assign todo " + that + " to agent bot.");
    return;
}

tags.task = that;
