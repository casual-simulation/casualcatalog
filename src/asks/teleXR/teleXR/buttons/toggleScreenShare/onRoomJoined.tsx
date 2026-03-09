console.log(`[${tags.system}.${tagName}] that:`, that);

const { roomName, options } = that;

masks.buttons = true;
thisBot.setEnabledState({ enabled: options.screen });