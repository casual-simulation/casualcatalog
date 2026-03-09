os.sleep(500).then(() => shout('onInstJoined'))

for (let i = 1; i < 12; i++) {
    os.sleep(i * 500).then(() => shout('onChat', { message: ".sleep" }))
}
