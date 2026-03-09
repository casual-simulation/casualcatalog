if (that && that.message) {
    if (that.message == '.stopHume') {
        thisBot.endHume();
        return;
    }

    let username = await thisBot.getUserName();

    if (!thisBot.vars.humeSocket) {
        setTagMask(thisBot, "awaitingText", {user: username, message: that.message});
        await thisBot.startHume();
    } else {
        thisBot.textResponse({user: username, message: that.message});
    }
}