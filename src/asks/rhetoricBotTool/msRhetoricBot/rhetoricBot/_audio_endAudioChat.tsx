// trigger when ending audio chat with hume ai

console.log("audio chat end");
masks.audioChat = false;
shout("resetACLabel");

const humeSocket = thisBot.vars.humeSocket;

if(humeSocket) {
    humeSocket.close(1000, 'User ended the chat');
    delete thisBot.vars.humeSocket;
}

try {
    await os.endAudioRecording();
} catch(e) {
    console.warn(e);
}