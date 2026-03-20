for (let i = 0; i < that.bots.length; ++i) {
    if (that.bots[i].tags.tool_array) {
        thisBot.sendSessionSettings();
        break;
    }
}
