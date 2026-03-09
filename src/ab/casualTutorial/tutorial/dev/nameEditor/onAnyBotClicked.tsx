if (tags.editing && that.bot.id != thisBot.id) {
    await os.showInput(that.bot.tags.name, {placeholder: 'name'}).then(name => {
        that.bot.tags.name = name
        that.bot.masks.label = name
    })
}