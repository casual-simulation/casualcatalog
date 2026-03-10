const { roomName, options } = that;

masks.home = true;
thisBot.setEnabledState({ enabled: options.audio });
console.log(`[${tags.system}] onRoomJoined`);