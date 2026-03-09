// trigger when starting audio chat with hume

console.log("audio chat start");
masks.audioChat = "loading";
shout("resetACLabel");

const endpoint = "wss://api.hume.ai/v0/evi/chat";
const accessToken = (await ai.hume.getAccessToken()).accessToken;
const configID = "e04b02d5-cb78-4292-aba4-a912d8926ddd";

const url = new URL(endpoint);
url.searchParams.set("access_token", accessToken);
url.searchParams.set("config_id", configID);

await os.beginAudioRecording({
    stream: true,
    mimeType: 'audio/wav'
});

const humeSocket = new WebSocket(url.toString());
thisBot.vars.humeSocket = humeSocket;
thisBot.vars.playingQueue = false;

let knowledgeBase = tags.knowledgeBase ?? [];

const session_settings = {
    "type": "session_settings",
    "variables": {
        "name": tags.name,
        "allowed_topics": JSON.stringify(knowledgeBase),
    }
};

humeSocket.addEventListener('open', (event) => {
    console.warn("Hume Socket opened: ", event);
    // shout("onHumeWebSocketOpened", event);
    humeSocket.send(JSON.stringify(session_settings));

    thisBot._audio_clearQueues();

    if (["learning", "whisper", "shout"].includes(tags.currentMode)) {
        thisBot.vars.playHumeAudio = true;
    }
});

humeSocket.addEventListener('close', (event) => {
    console.warn("Hume Socket closed: ", event);
    thisBot._audio_endAudioChat();
    // shout("onHumeChatEnded", event);
});

humeSocket.addEventListener('message', async (event) => {
    const data = JSON.parse(event.data);

    console.log("blueb", data);

    if (data.type == "audio_output") {
        if (["learning", "whisper", "shout"].includes(tags.currentMode)) {
            thisBot._audio_queueAudio(data.data);
        }
    }
    else if (data.type == "assistant_message") {
        if (["learning", "whisper", "shout"].includes(tags.currentMode) && thisBot.vars.playHumeAudio == true) {
            const message = data.message.content;
            thisBot._audio_queueText(message);
            // ab.log({ message: message, name: tags.name, space: "shared", rbIgnoreMessage: true });
        }
    }
    else if (data.type == "error") {
        console.warn('error: ', data.message);
    }
    else if (data.type == "user_message") {
        let username = "user";

        if (authBot && authBot.tags.name && authBot.tags.name != "") {
            username = authBot.tags.name;
        } else if (ab.links.console.masks.preferredName) {
            username = ab.links.console.masks.preferredName;
        } else {
            username = await os.showInput("", {
                title: "What would you like me to call you?"
            });
            ab.links.console.masks.preferredName = username;
        }

        const message = data.message.content;

        ab.log({
            message: message,
            name: username,
            space: "shared",
            rbIgnoreMessage: tags.currentMode != "learning",
            audioInput: true,
            messageOrigin: configBot.id,
            rbProcessMessage: tags.currentMode == "learning"
        });

        // thisBot.clearQueues();

        if (["learning", "whisper", "shout"].includes(tags.currentMode)) {
            thisBot.vars.playHumeAudio = true;
        }
    }
    else if (data.type == "tool_call") {
        console.log("Tool called: ", data.name, data);
        if (data.name == "read_pdf") {
            thisBot._ai_interpretPDF();
        }
        else if (data.name == "getAllowedTopics") {
            thisBot._audio_updateAI();
            let knowledgeBase = tags.knowledgeBase ?? [];
            const toolResponseMessage = {
                type: "tool_response",
                tool_call_id: data.tool_call_id,
                content: JSON.stringify(knowledgeBase),
            };
            humeSocket.send(JSON.stringify(toolResponseMessage));
        }
    }
    else if (data.type == "user_interruption") {
        thisBot._audio_clearQueues();

        if (["learning", "whisper", "shout"].includes(tags.currentMode)) {
            thisBot.vars.playHumeAudio = true;
        }
    }
    else {
        console.log("unexpected message:", data.type, data);
    }
});