console.log("playQueuedAudio triggered", thisBot.vars.playingQueue)

if (thisBot.vars.playingQueue)
{
    return;
}

thisBot.vars.playingQueue = true;

while (thisBot.masks.audioQueue.length > 0)
{
    const activeAudio = thisBot.masks.audioQueue[0];
    const activeText = thisBot.masks.textQueue[0];

    thisBot.masks.audioQueue.splice(0, 1);
    thisBot.masks.textQueue.splice(0,1);
    if(thisBot.vars.playHumeAudio == true){
        let soundId = os.playSound(activeAudio);
        thisBot.masks.activeSound = soundId;
        ab.log({ message: activeText, name: tags.name, space: "shared", rbIgnoreMessage: true, rbProcessMessage: true, messageOrigin: configBot.id });
        
        await os.sleep((getDuration(activeAudio) * 1000));
        
        thisBot.masks.activeSound = null;
    }

    // os.playSound(activeAudio);
    // thisBot.masks.audioQueue.splice(0, 1);
    // await os.sleep((getDuration(activeAudio) * 1000) + 500);

    console.log("AUDIO QUEUE: ", thisBot.masks.audioQueue);
}

thisBot.vars.playingQueue = null;

function base64ToArrayBuffer(base64) {
    const binaryString = self.atob(base64.split(',')[1]);
    const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return bytes.buffer;
}

function getWavDuration(arrayBuffer) {
    const view = new DataView(arrayBuffer);

    // Check the "RIFF" identifier
    if (view.getUint32(0, false) !== 0x52494646) {
        throw new Error("Invalid WAV file");
    }

    // Check the "WAVE" identifier
    if (view.getUint32(8, false) !== 0x57415645) {
        throw new Error("Invalid WAV file");
    }

    // Get the byte rate from the fmt subchunk
    const byteRate = view.getUint32(28, true);

    // Get the total number of bytes in the data subchunk
    const dataChunkSize = view.getUint32(40, true);

    // Calculate duration
    const duration = dataChunkSize / byteRate;

    return duration;
}

function getDuration(base64) {
    var arrBuffer = base64ToArrayBuffer(base64);
    return getWavDuration(arrBuffer);
}

