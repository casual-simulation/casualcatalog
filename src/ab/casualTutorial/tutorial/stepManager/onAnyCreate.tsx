if (!tags.activated) return;

if (that.bot.tags.space == "shared" && !that.bot.tags.ab1 && !that.bot.tags.stepIgnore) {
    if (tags.development) {
        if (await (os.showConfirm({title: "Add bot to this step?"}))) {
            that.bot.tags.sequence = tags.sequence
            that.bot.tags.step = tags.step
            setTag(that.bot, "home", null)
            setTagMask(that.bot, "home", true, "local")
        }
    } else {
        that.bot.tags.sequence = tags.sequence
        that.bot.tags.step = tags.step
        setTag(that.bot, "home", null)
        setTagMask(that.bot, "home", true, "local")
    }
    
}