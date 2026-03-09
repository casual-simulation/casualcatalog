// Remove old speech bubble
os.log("Hiding bubble")
shout("hideSpeechBubble")

// Figure out where to start
var {newStep, sequence} = that
if (!sequence) { sequence = stepManager.tags.sequence }
var dialogueIndex = 0
os.log("Got info:", newStep, sequence, dialogueIndex)
// Execute the dialogue
whisper(thisBot, "executeDialogue", { step: newStep, sequence, dialogueIndex })
