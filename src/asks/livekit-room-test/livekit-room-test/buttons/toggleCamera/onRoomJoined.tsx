const { roomName, options } = that;

masks.home = true;
thisBot.setEnabledState({ enabled: options.video });
console.log(`[${tags.system}] onRoomJoined`);