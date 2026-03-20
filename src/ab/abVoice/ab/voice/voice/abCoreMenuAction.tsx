if (that && that.message) {
    if (that.message.toLowerCase() == '.stophume') {
        thisBot.endHume();
        return;
    }

    let username = await thisBot.getUserName();

    if (!thisBot.vars.humeSocket) {
        setTagMask(thisBot, "awaitingText", {user: username, message: that.message});
        await thisBot.startHume();
    } else {
        thisBot.sendUserInput({user: username, message: that.message});
    }
}