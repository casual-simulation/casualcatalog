const inst = os.getCurrentInst();

const result = await os.leaveRoom(inst, {
    endpoint: 'https://casualos.me'
});

console.log(result);