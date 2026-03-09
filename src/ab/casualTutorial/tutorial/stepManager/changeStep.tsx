// Prevent double-clicking
if (tags.working) return

// Save the steps we care about
var oldStep = tags.step ?? 0
var newStep = that.newStep

// Prevent going below step 1
if (newStep < 1) return

// We will continue
setTagMask(thisBot, "working", true, "local")
shout("hideSpeechBubble")
shout("closeTagPortal")

// Handle changing sequences
var oldSequence = tags.sequence
var newSequence = that.newSequence ?? tags.sequence
if (that.newSequence) {
    shout("changeTitle", {sequence: that.newSequence})
}

// Change the step title
shout("changeStepTitle", {sequence: newSequence, newStep})

// Change the step for the local user
setTagMask(this, "step", newStep, "local")

// Make bots from current step disappear
var oldBots = getBots(byTag("sequence", tags.sequence), byTag("step", oldStep))
if (oldBots) {
    for (var b of oldBots) {
        if (b.tags.type == "manager") continue;
        var initialScale = b.tags.scale ?? 1
        await animateTag(b, "scale", {
            fromValue: initialScale,
            toValue: initialScale * 1.1,
            duration: 0.1
        })

        animateTag(b, "scale", {
            fromValue: initialScale * 1.1,
            toValue: 0,
            duration: 0.25,
            easing: {
                type: "exponential",
                mode: "in"
            }
        })
    }
}

// Make new bots appear from new sequence if specified, or current sequence if not
var newBots = getBots(byTag("sequence", newSequence), byTag("step", newStep))
for (var b of newBots) {
    if (b.tags.type == "manager") continue;
    if (b.tags.color !== 'transparent') os.playSound(soundBot.tags.popIn);

    var botScale = b.tags.scale ?? 1

    setTagMask(b, "home", true, "local")
    setTagMask(b, "scale", 0, "local")

    await animateTag(b, "scale", {
        fromValue: 0,
        toValue: botScale * 1.1,
        duration: 0.1,
        tagMaskSpace: 'local'
    })

    animateTag(b, "scale", {
        fromValue: botScale * 1.1,
        toValue: botScale,
        duration: 0.25,
        tagMaskSpace: 'local',
        easing: {
            type: "exponential",
            mode: "out"
        }
    })
}


os.sleep(500).then(() => {
    // Update sequence if it was specified
    if (that.newSequence) { setTagMask(thisBot, "sequence", newSequence, "local") }

    // Allow a new step change
    setTagMask(thisBot, "working", false, "local");

    // Remove scale masks in case the user wants to change them
    for (var b of newBots) {
        if (b.id !== thisBot.id) {
            clearTagMasks(b)
            setTagMask(b, "home", true, "local")
        }
    }

    // Clean up the old bots
    if (oldStep !== newStep || newSequence !== oldSequence) {
        for (var b of oldBots) {
            if (b.tags.type !== "manager") {
                setTag(b, "home", null)
                setTagMask(b, "home", false, "local")
                clearTagMasks(b)
            }
        }
    }
})

// Start the dialogue, if shift isn't pressed
const skipDialogue = os.getInputState('keyboard', 'Shift')
if (!skipDialogue) {
    speechManager.moveToStep({sequence: newSequence, newStep})
}
