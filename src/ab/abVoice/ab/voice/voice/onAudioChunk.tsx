let audioData;
if (tags.muted && tags.sentInitChunk) {
    const silence = new Blob([new Uint8Array(that.size)], { type: 'audio/wav' });
    audioData = await blobToBase64(silence);
} else {
    audioData = await blobToBase64(that);
}

if (!masks.sentInitChunk) {
    setTagMask(thisBot, "sentInitChunk", true);
}

const humeSocket = thisBot.vars.humeSocket;

if(humeSocket) {
    if (tags.debugMode) {
        const packetHash = crypto.hash('sha1', 'hex', audioData);
        console.log(`[${tags.system}.${tagName}] audio_input packet hash:`, packetHash);
    }

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