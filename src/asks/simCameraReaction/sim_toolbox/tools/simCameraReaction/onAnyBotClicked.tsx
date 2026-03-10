if (tags.choosingFocusBot && that?.bot && that.bot != thisBot && that.bot.tags[tags.dimension] == true) {
    tags.reactionValue = getID(that.bot);
    os.toast("camera focus chosen");
    tags.choosingFocusBot = null;
    thisBot.onClick();
}