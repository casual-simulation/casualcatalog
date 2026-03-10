console.log("audio chunk recieved")

masks.audioChat == "loading" ? masks.audioChat = true : null;
shout("resetACLabel");

const humeSocket = thisBot.vars.humeSocket;

if(humeSocket && masks.audioChat == true) {
    humeSocket.send(JSON.stringify({
        data: await blobToBase64(that),
        type: "audio_input"
    }));
}

async function blobToBase64(blob) {
  // Read the Blob as an ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();
  
  // Convert the ArrayBuffer to a Base64 string
  const base64String = bytes.toBase64String(new Uint8Array(arrayBuffer), 'audio/wav');
  
  return base64String;
}