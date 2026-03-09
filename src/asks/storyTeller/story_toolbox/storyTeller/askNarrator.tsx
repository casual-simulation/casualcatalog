if (!that) {
    os.toast("Story Narrator: Could not find messages");
    return;
}

const aiChatOptions: AIChatOptions = {
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}

let response = await ai.chat(that, aiChatOptions);
response = response.content.replace(/```json\n?|```/g, '');

try {
    response = JSON.parse(response);
} catch (e) {
    console.log("Error responding as narrator: ", e, response);
    if (typeof(response) == 'string') {
        response = {
            "type": "narration",
            "message": response
        }
    } else {
       return;
    }
}

if (!response) {
    return;
}

console.log("Narrator Response: ", response);
if (typeof(response) == 'string') {
    response = {
        "type": "narration",
        "message": response
    }
}

if (response["type"] && response["type"] == "promptElement") {
    const targetBot = getBot("label", response.target);
    if (targetBot) {
        await targetBot.respond(response.prompt);
        await os.focusOn(targetBot);
    }
}
else if (response["type"] && response["type"] == "promptPlace") {
    const targetBot = getBot("label", response.target);
    if (targetBot) {
        await targetBot.onClick();
    }
}
else if (response["type"] && response["type"] == "createElement") {
    ab.links.search.onLookupAskID({
                askID: "storyElement",
                sourceEvent: 'tool',
                eggParameters: {
                    toolboxBot: tags.toolbox,
                    gridInformation: tags.gridInformation,
                    storyParameters: {
                        prompt: response?.prompt,
                        target: response?.target
                    }
                },
            })
} else if (response["type"] && response["type"] == "createPlace") {
    ab.links.search.onLookupAskID({
                askID: "storyPlace",
                sourceEvent: 'tool',
                eggParameters: {
                    toolboxBot: tags.toolbox,
                    gridInformation: tags.gridInformation,
                    storyParameters: {
                        prompt: response?.prompt,
                        target: response?.target
                    }
                },
            })
}  else {
    ab.log({message: response?.message, name: tags.label, space: "shared"});
}