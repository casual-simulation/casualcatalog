const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

const inst = os.getCurrentInst();

const result = await os.leaveRoom(inst, {
    endpoint: 'https://casualos.me'
});

console.log(result);