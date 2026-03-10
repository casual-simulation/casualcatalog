const { bot, from, to } = that;

bot.tags[from] = null;
bot.tags[to] = true;

const fromPosition = transform.getBotPosition(bot, from);
const fromRotation = transform.getBotRotation(bot, from);
const fromScale = transform.getBotScale(bot, from);

transform.setBotPosition(bot, to, fromPosition);
transform.setBotRotation(bot, to, fromRotation);
transform.setBotScale(bot, to, fromScale);