const endpoint = "wss://api.hume.ai/v0/evi/chat";
const accessToken = (await ai.hume.getAccessToken()).accessToken;
//const configID = "e04b02d5-cb78-4292-aba4-a912d8926ddd";
const configID = "ff1133fb-2a27-4a9c-8801-258ecf7eb2aa";

const url = new URL(endpoint);
url.searchParams.set("access_token", accessToken);
url.searchParams.set("config_id", configID);

const humeSocket = new WebSocket(url.toString());
thisBot.vars.humeSocket = humeSocket;
thisBot.vars.playingQueue = false;

const session_settings = {
    "type": "session_settings",
    "variables": {
        "name": abPersonality.tags.abBuilderIdentity,
        "catalog_asks": await thisBot.getCatalogAsks()
    }
};

humeSocket.addEventListener('open', (event) => {
    console.warn("Hume Socket opened: ", event);

    thisBot.clearQueues();
    setTagMask(thisBot, "handRaised", false);

    setTagMask(thisBot, "latestInquiry", null);
    setTagMask(thisBot, "latestInquiryID", null);

    thisBot.vars.playHumeAudio = true;

    //If console is not open, open console
    if (!links.console.masks.open) {
        whisper(links.console, "showConsole");
        links.console.masks.open = true;
    }

    humeSocket.send(JSON.stringify(session_settings));

    setTagMask(thisBot, "sentInitChunk", false);

    os.beginAudioRecording({
        stream: true,
        mimeType: 'audio/wav'
    });

    os.toast("Hume active...");
    shout("onHumeSocketOpened");
});

humeSocket.addEventListener('close', (event) => {
    console.warn("Hume Socket closed: ", event);
    thisBot.endHume();

    if (links.mute && !links.mute.tags.muted) {
        links.mute.abCoreMenuAction();
    }

    setTagMask(thisBot, "latestInquiry", null);
    setTagMask(thisBot, "latestInquiryID", null);

    os.toast("Hume closed...");
    // shout("onHumeChatEnded", event);
});

humeSocket.addEventListener('message', async (event) => {
    const data = JSON.parse(event.data);

    if (data.type == "audio_output") {
        thisBot.queueAudio(data.data);
    }
    else if (data.type == "assistant_message") {
        const message = data.message.content;

        thisBot.queueText(message); 
        
    }
    else if (data.type == "assistant_end") {
        //tags.thinking = true;
    }
    else if (data.type == "error") {
        console.warn('error: ', data.message);
    }
    else if (data.type == "user_message") {
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
        console.log("Tool called: ", data.name, data);
        if (tags.debugMode == true && data.name != 'think') {
            ab.log({
                message: data.name + ': ' + data.parameters,
                name: abPersonality.tags.abBuilderIdentity,
                space: "shared",
                messageOrigin: configBot.id,
            });
        }
        if (data.name == "think") {
            if (JSON.parse(data.parameters).message) {
                ab.log({ message: JSON.parse(data.parameters).message, name: abPersonality.tags.abBuilderIdentity, space: "shared", messageOrigin: configBot.id });
            }
        } else if (data.name == "makeToDoBot") {
            thisBot.makeToDoBot({id: data.tool_call_id, data: data.parameters});
        } else if (data.name == "completeToDos") {
            thisBot.completeToDos({id: data.tool_call_id});
        }  else if (data.name == "make") {
            thisBot.makeSomething({id: data.tool_call_id, data: data.parameters});
        }  else if (data.name == "pullFromCatalog") {
            thisBot.pullFromCatalog({id: data.tool_call_id, data: data.parameters});
        }  else if (data.name == "getSceneData") {
            thisBot.getSceneData({id: data.tool_call_id, data: data.parameters});
        }  else if (data.name == "seeUserFocus") {
            thisBot.seeUserFocus({id: data.tool_call_id, data: data.parameters});
        }  else if (data.name == "clickOn") {
            thisBot.aiClick(data.parameters);
            thisBot.sendToolCompleteMessage({id: data.tool_call_id});
        }  
    }
    else if (data.type == "user_interruption") {
        thisBot.clearQueues();

        thisBot.vars.playHumeAudio = true;
    }
    else {
        console.log("unexpected message:", data.type, data);
    }
});