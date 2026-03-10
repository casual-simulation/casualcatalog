// Required Parameters
const text = that;

thisBot.masks.textQueue = thisBot.masks.textQueue ? [...thisBot.masks.textQueue].concat(text) : [text];