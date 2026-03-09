globalThis.stepManager = thisBot
os.bufferSound(tags.inSound)

// Wait for user input before activating (avoids adding other bots from the egg to step 1)
tags.activated = false

stepManager.tags.onAnyBotPointerDown = `@
tags.activated = true
tags.onKeyDown = ''
tags.onAnyBotPointerDown = ''
tags.onGridDown = ''`

stepManager.tags.onKeyDown = `@
tags.activated = true
tags.onKeyDown = ''
tags.onAnyBotPointerDown = ''
tags.onGridDown = ''`

stepManager.tags.onGridDown = `@
tags.activated = true
tags.onKeyDown = ''
tags.onAnyBotPointerDown = ''
tags.onGridDown = ''`

os.sleep(1000).then(() => {
    thisBot.changeStep({newStep: 1})
})