// Save the info we'll need from the shout
var { text, focus, onClick, scaleX, scaleY } = that
var speakerName = that.name
var speakerId = that.id

// Initialize variable to hold the speaking bot
let speaker

if (speakerId) { // Find bot by id, if it was given
    speaker = getBot(byID(speakerId))
} else { // Find bot by its name if not

    speaker = getBot(
        byTag("name", speakerName),
        byTag("sequence", that.sequence),
        byTag("step", that.step)
    )

    if (!speaker) {
        speaker = getBot(
            byTag("name", speakerName),
            inDimension(os.getCurrentDimension())
        )
    }
}

// Update this bot's label
setTagMask(thisBot, "label", text, "local")

// End if the bot can't be found
if (!speaker) return

// Get the other parts of the speech bubble
var bubbleTail = getBot(byTag("type", "speechBubbleTail"))
var speechTransformer = getBot(byTag("type", "speechBubbleTransformer"))

// Make sure all bots have the right transformer
tags.transformer = speechTransformer.id
bubbleTail.tags.transformer = speechTransformer.id

// Update the transformer's position
var dim = os.getCurrentDimension()
setTagMask(speechTransformer, "transformer", speaker.id, "local")

// Keep the transformer (and all its children) from scaling up with the bot
var speakerScale = speaker.masks.scale ?? speaker.tags.scale ?? 1
setTagMask(speechTransformer, "scale", 1 / speakerScale, "local")

if (speaker.tags.scaleZ) speakerScale += speaker.tags.scaleZ / 2
setTagMask(speechTransformer, `${dim}Z`, (1 - speakerScale) / 2 + 1, "local")

// Make sure the speech bubble doesn't get screwed up by speaker scale X/Y/Z
setTagMask(speechTransformer, "scaleX", 1 / (speaker.tags.scaleX ?? 1), "local")
setTagMask(speechTransformer, "scaleY", 1 / (speaker.tags.scaleY ?? 1), "local")
setTagMask(speechTransformer, "scaleZ", 1 / (speaker.tags.scaleZ ?? 1), "local")

// Re-size the speech bubble
setTagMask(thisBot, "scaleX", scaleX ?? 3, "local")
setTagMask(thisBot, "scaleY", scaleY ?? 2, "local")

// Move this bot up based on its scale
setTagMask(thisBot, `${dim}Z`, ((masks.scaleY ?? tags.scaleY) / 2) + 0.25, "local")

// Focus on the speaking bot
if (focus) {
    os.focusOn(speaker, {zoom: 20})
}

// Update what happens when the bubble is clicked on
setTagMask(thisBot, "onClick", onClick ?? `@ shout('hideSpeechBubble')`, "local")

os.playSound(soundBot.tags.say)


// Put the bots in the current dimension
setTagMask(thisBot, dim, true, "local")
setTagMask(bubbleTail, dim, true, "local")
setTagMask(speechTransformer, dim, true, "local")
