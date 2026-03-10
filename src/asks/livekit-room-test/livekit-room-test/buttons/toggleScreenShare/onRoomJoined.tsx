const { roomName, options } = that;

masks.home = true;
thisBot.setEnabledState({ enabled: options.screen });
console.log(`[${tags.system}] onRoomJoined`);