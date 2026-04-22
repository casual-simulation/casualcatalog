if (thisBot.vars.humeSocket) {
    return;
}

const endpoint = "wss://api.hume.ai/v0/evi/chat";
const accessToken = (await ai.hume.getAccessToken()).accessToken;
// const configID = "e04b02d5-cb78-4292-aba4-a912d8926ddd";
// const configID = "ff1133fb-2a27-4a9c-8801-258ecf7eb2aa";
const configID = "93f3cb31-d098-484e-b511-1a444730beda";

const url = new URL(endpoint);
url.searchParams.set("access_token", accessToken);
url.searchParams.set("config_id", configID);

const humeSocket = new WebSocket(url.toString());
thisBot.vars.humeSocket = humeSocket;
thisBot.vars.playingQueue = false;

humeSocket.addEventListener('open', (event) => {
    console.log(`[${tags.system}.${tagName}] Hume Socket opened: `, event);

    thisBot.clearQueues();
    setTagMask(thisBot, "handRaised", false);

    thisBot.vars.playHumeAudio = true;

    //If console is not open, open console
    if (!links.console.masks.open) {
        whisper(links.console, "showConsole");
        links.console.masks.open = true;
    }

    thisBot.sendSessionSettings();

    setTagMask(thisBot, "sentInitChunk", false);

    os.beginAudioRecording({
        stream: true,
        mimeType: 'audio/wav'
    });

    os.toast("Hume active...");
    shout("onHumeSocketOpened");
});

humeSocket.addEventListener('close', (event) => {
    console.log(`[${tags.system}.${tagName}] Hume Socket closed: `, event);
    thisBot.endHume();

    os.toast("Hume closed...");
    shout("onHumeSocketClosed");
});

humeSocket.addEventListener('message', async (event) => {
    const data = JSON.parse(event.data);

    if (tags.debugMode) {
        console.log(`[${tags.system}.${tagName}] message received:`, data);
    }

    if (data.type == "audio_output") {
        thisBot.queueAudio(data.data);
    } else if (data.type == "assistant_message") {
        const message = data.message.content;
        thisBot.queueText(message);
    } else if (data.type == "assistant_end") {
        // do nothing
    } else if (data.type == "error") {
        console.error(`[${tags.system}.${tagName}] hume error:`, data);
    } else if (data.type == "user_message") {
        let username = await thisBot.getUserName();
        setTagMask(thisBot, "handRaised", false);

        const message = data.message.content;

        if (message) {
            ab.log({
                message: message,
                name: username,
                space: "shared",
                messageOrigin: configBot.id,
            });
        }
    }
    else if (data.type == "tool_call") {
        console.log(`[${tags.system}.${tagName}] tool call: `, data);

        if (data.name == "think") {
            const parameters = JSON.parse(data.parameters);
            if (parameters.message) {
                ab.log({ message: parameters.message, name: `${abPersonality.tags.abBuilderIdentity} thoughts:`, space: "shared", messageOrigin: configBot.id });
            }

            thisBot.sendToolResponse({ id: data.tool_call_id });
        } else if (data.name == "ask") {
            const parameters = JSON.parse(data.parameters);

            await ab.links.ask.askGPT({
                inquiry: parameters.ask,
                menuType: "core",
                agentMode: 'plan',
                menuActionData: null,
                sourceId: "abBot",
                historyStorageBot: ab.links.remember,
            })
            
            thisBot.sendSessionSettings();
            thisBot.sendToolResponse({ id: data.tool_call_id });
        } else {
            console.error(`[${tags.system}.${tagName}] tool ${data.name} is not implemented.`, data);
        }
    } else if (data.type == "user_interruption") {
        thisBot.clearQueues();
        thisBot.vars.playHumeAudio = true;
    } else {
        console.warn(`[${tags.system}.${tagName}] ignoring message:`, data);
    }
});