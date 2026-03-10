const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

const inst = os.getCurrentInst();
const options = await os.getRoomOptions(inst);

let screenEnabled = false;
if (options.success) {
    screenEnabled = options.options.screen;
}

const result = await os.setRoomOptions(inst, {
    screen: !screenEnabled
})

console.log('setRoomOptions:', result);