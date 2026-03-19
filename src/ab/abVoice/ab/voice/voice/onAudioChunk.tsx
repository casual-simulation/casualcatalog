let audioData;
if (links.mute && links.mute.tags.muted && tags.sentInitChunk) {
    const silence = new Blob([new Uint8Array(that.size)], { type: 'audio/wav' });
    audioData = await blobToBase64(silence);
} else {
    audioData = await blobToBase64(that);
}

setTagMask(thisBot, "sentInitChunk", true);

const humeSocket = thisBot.vars.humeSocket;

const packetHash = crypto.hash('sha1', 'hex', audioData);

if(humeSocket) {
    console.log("packet here", packetHash);

    humeSocket.send(JSON.stringify({
        "type": "audio_input",
        "data": audioData
    }));
}

async function blobToBase64(blob) {
  // Read the Blob as an ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();
  
  // Convert the ArrayBuffer to a Base64 string
  const base64String = bytes.toBase64String(new Uint8Array(arrayBuffer), 'audio/wav');
  
  return base64String;
}