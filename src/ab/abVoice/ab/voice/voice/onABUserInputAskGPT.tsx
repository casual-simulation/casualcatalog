if (tags.debugMode) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (tags.voiceEnabled) {
    if (that && that.inquiry) {
        let username = await thisBot.getUserName();

        if (!thisBot.vars.humeSocket) {
            setTagMask(thisBot, "awaitingText", {user: username, message: that.inquiry});
            await thisBot.startHume();
        } else {
            thisBot.sendUserInput({user: username, message: that.inquiry});
        }

        // Tell the shouter that we have consumed the user input by returning a value.
        return true;
    }
}