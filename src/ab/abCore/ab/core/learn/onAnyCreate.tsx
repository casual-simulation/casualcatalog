const { bot } = that;

if (bot) {
    // [Ryan] I'm not sure why we need to do this, but without awaiting here we are seeing strange
    // artifacts with new bots created via ab. Multiple lines get drawn instead of just one to the selected bot and the arm
    // doesnt get updated properly to hide. Its as if bot updates get messed up or perhaps lost without this await.
    await os.sleep(0);
    
    // Assign a creation timestamp for the bot.
    let timestamp = os.agreedUponTime;

    if (Number.isNaN(timestamp)) {
        timestamp = os.localTime;
    }

    setTagMask(bot, 'abCreateTime', timestamp, 'shared');
}