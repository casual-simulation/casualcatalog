const base64Audio = that;

const mimeType = "audio/wav"; // Adjust MIME type as needed
const dataURL = `data:${mimeType};base64,${base64Audio}`;

thisBot.masks.audioQueue = thisBot.masks.audioQueue ? [...thisBot.masks.audioQueue].concat(dataURL) : [dataURL];

//thisBot.playQueuedAudio();
if (!tags.handRaised) {
    setTagMask(thisBot, "handRaised", true);
}
