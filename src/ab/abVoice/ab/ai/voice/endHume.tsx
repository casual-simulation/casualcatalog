const humeSocket = thisBot.vars.humeSocket;

const notifBots = getBots("abVoiceNotificationBot", true);
destroy(notifBots);

if(humeSocket) {
    humeSocket.close(1000, 'User ended the chat');
    delete thisBot.vars.humeSocket;
}

try {
    await os.endAudioRecording();
} catch(e) {
    console.warn(e);
}