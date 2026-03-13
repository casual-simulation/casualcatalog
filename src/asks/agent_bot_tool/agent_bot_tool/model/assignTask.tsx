const taskBot = getBot(byID(that));
if (!taskBot || !taskBot.tags.toDo) {
    console.log("Could not assign task " + that + " to agent bot.");
    return;
}

tags.task = that;