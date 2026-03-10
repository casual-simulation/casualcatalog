// Shouts the dialogue at a given index for the given or current step & sequence
// Focuses the camera on the center if there is no dialogue
var {step, sequence, dialogueIndex, dimension, id} = that

if (!step) { step = stepManager.tags.step }
if (!sequence) { sequence = stepManager.tags.sequence }
if (!dialogueIndex) { dialogueIndex = 0 }

try {
    shout("say", {sequence, step, ...tags.dialogue[sequence][step][dialogueIndex], dimension, id})
} catch (err) {
    os.focusOn(getBot(byTag("type", "floor")), {zoom: 10})
}
