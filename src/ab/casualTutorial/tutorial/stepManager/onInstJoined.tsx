globalThis.stepManager = thisBot
os.bufferSound(tags.inSound)

if (thisBot.tags.step != 0) return

os.sleep(500).then(() => {
    thisBot.changeStep({newStep: tags.step != 0 ? tags.step : 1})
})