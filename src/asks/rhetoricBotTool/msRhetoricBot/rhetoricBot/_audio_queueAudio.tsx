// Required Parameters
const base64Audio = that;

// Optional Parameters

const mimeType = "audio/wav"; // Adjust MIME type as needed
const dataURL = `data:${mimeType};base64,${base64Audio}`;

// os.playSound(dataURL);

// const audioObject = { audio: dataURL, timestamp: os.isCollaborative() ? os.agreedUponTime : os.localTime }

thisBot.masks.audioQueue = thisBot.masks.audioQueue ? [...thisBot.masks.audioQueue].concat(dataURL) : [dataURL];

thisBot._audio_playQueuedAudio();

// console.log("audio queue:",thisBot.masks.audioQueue)