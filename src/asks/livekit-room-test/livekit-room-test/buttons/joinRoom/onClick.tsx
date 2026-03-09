const inst = os.getCurrentInst();

const result = await os.joinRoom(inst, {
    endpoint: 'https://casualos.me'
})

console.log(result);