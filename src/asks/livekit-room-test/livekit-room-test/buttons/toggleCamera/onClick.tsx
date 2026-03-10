const inst = os.getCurrentInst();
const options = await os.getRoomOptions(inst);

let videoEnabled = false;
if (options.success) {
    videoEnabled = options.options.video;
}

const result = await os.setRoomOptions(inst, {
    video: !videoEnabled
})

console.log('setRoomOptions:', result);