// used to interpret and handle a user inputting into the chat via a text or audio message and having RB respond accordingly

const messageBot = that.consoleLogMessageBot;
const botSpace = getTag(messageBot, "space");
const rbIgnoreMessage = getTag(messageBot, "rbIgnoreMessage");
const rbProcessMessage = getTag(messageBot, "rbProcessMessage");
const messageOrigin = getTag(messageBot, "messageOrigin");
const audioInput = getTag(messageBot, "audioInput");

const user = getTag(messageBot, "name");
const message = getTag(messageBot, "message");
const time = getTag(messageBot, "timestamp") ?? 0;
const timeNow = os.isCollaborative() ? os.agreedUponTime : os.localTime;
const timeDiff = Math.abs(timeNow - time);
const mode = tags.currentMode;

const ignoredMessage = rbProcessMessage != true || user == tags.name || message === "Memory updated." || audioInput && tags.audioChat != true;
const selfMessage = user == tags.name;
const recentMessage = timeDiff < 1000;

// console.log("currentTime:", timeNow);
// console.log("messageTime:", time);
// console.log("timeDiff:", timeDiff);

// console.log("ignoredMessage: ", ignoredMessage);
// console.log("selfMessage: ", selfMessage);
// console.log("recentMessage: ", recentMessage);

// console.log("message bot", that.consoleLogMessageBot);

if (ignoredMessage) {
    console.log("Message to ignore: ", messageBot);
}
else if (selfMessage) {
    console.log("RB Message:", messageBot);
    thisBot._menu_rbThinking(false);
}
else if (recentMessage) {
    console.log("Non-casual.bot or self message detected:", messageBot);
    // console.log("message sender:", user);

    thisBot._menu_rbThinking(true);


    console.log("configBot id comparison: ", messageOrigin == configBot.id);

    // console.log("current mode: ", mode);

    if (mode == "learning" && (botSpace == "tempLocal" || (botSpace == "shared" && configBot.id === messageOrigin))) {
        let pdfResponse = await ai.chat(`Determine from this message if a user wants you to read or interpret a pdf for them: "${message}". If yes, respond with only the word 'YES' exactly. If not, respond only with the word 'NO' exactly. Responding with anything other than YES or NO is considered a failure.`, {
            preferredModel: tags.aiModel
        })

        console.log("pdf response: ", pdfResponse);

        if (pdfResponse.toUpperCase() == "YES") {
            await thisBot._ai_interpretPDF();
        }
        else {
            // let subjectResponse = await thisBot._ai_getSubjects({ user: user, message: message });
            // console.log("topicResponse", subjectResponse);
            // links.brainLink.createFGBNeurons({ neuronMods: subjectResponse, neuronsColor: "white" });

            // let detailsResponse = await thisBot.getUpdatedDetails({ user: user, message: message });
            // links.brainLink.updateNeurons(detailsResponse);

            let learnResponse = await thisBot._ai_learnResponse({ user: user, message: message });
            console.log("learn response:", learnResponse);

            if (learnResponse.success == true) {
                thisBot._brain_updateKnowledge(learnResponse);

                thisBot._console_postMessage({ "message": "Memory updated.", "publicMessage": true });
                thisBot._menu_rbThinking(false);

                const humeSocket = thisBot.vars.humeSocket;
                // console.log("Hume Websocket: ", humeSocket);

                if (audioInput && messageOrigin == configBot.id && humeSocket) {
                    await os.sleep(100);
                    let knowledgeBase = tags.knowledgeBase ?? [];

                    const systemSettings = JSON.stringify(knowledgeBase);
                    console.log("allowed_topics:", systemSettings)

                    humeSocket.send(JSON.stringify({
                        "type": "session_settings",
                        "variables": {
                            "allowed_topics": systemSettings,
                        }
                    }));
                }
            }
            else {
                thisBot._menu_rbThinking(false);
                thisBot._console_postMessage({ "message": "Learning error encountered, memory not updated." })
            }
        }


    }
    else if (mode == "whisper" && botSpace == "tempLocal") {
        let responseResponse = await thisBot._ai_getResponse({ user: user, message: message });
        // console.log("responseResponse", responseResponse);
        thisBot._console_postMessage({ "message": responseResponse, "publicMessage": false });
    }
    else if (mode == "shout" && botSpace == "shared" && messageOrigin == configBot.id) {
        let responseResponse = await thisBot._ai_getResponse({ user: user, message: message });
        // console.log("responseResponse", responseResponse);
        thisBot._console_postMessage({ "message": responseResponse, "publicMessage": true });
    }
}
else {
    console.log("Message failed all other tests: ", messageBot)
}

