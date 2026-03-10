const inst = os.getCurrentInst();
const options = await os.getRoomOptions(inst);

let audioEnabled = false;
if (options.success) {
    audioEnabled = options.options.audio;
}

const result = await os.setRoomOptions(inst, {
    audio: !audioEnabled
});

console.log('setRoomOptions:', result);