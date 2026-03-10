const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

const inst = os.getCurrentInst();

const result = await os.joinRoom(inst, {
    endpoint: 'https://casualos.me',
    audio: false,
    screen: false,
    video: false,
})

console.log(result);