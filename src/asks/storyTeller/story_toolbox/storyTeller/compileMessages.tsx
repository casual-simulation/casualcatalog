//Grab elements
const targetsArr = [];
const targets = getBots("storyElement");
for (const bot of targets) {
    targetsArr.push(bot?.tags?.label);
}

//grab places
const placesArr = [];
const places = getBots("storyPlace");
for (const bot of places) {
    placesArr.push({target: bot?.tags?.label, prompt: bot?.tags?.placePrompt});
}

const aiMessageArr = [];

//Get message log
const messageLogArr = [];
if (links.console.vars.messageBotIds) {
    const messageBots = links.console.vars.messageBotIds;

    for (const botID of messageBots) {
        const messageBot = getBot("id", botID);
        if (messageBot && messageBot.tags.space == "shared") {
            messageLogArr.push({
                message: messageBot.tags.message || "",
                timestamp: messageBot.tags.timestamp,
                name: messageBot.tags.name
            })
        }
    }

    messageLogArr.sort( (a, b) => new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1 );
    messageLogArr.reverse();
}

for (let i = 0; i < messageLogArr.length; ++i) {
    aiMessageArr.push({
        role: messageLogArr[i].name == tags.label ? "assistant" : "user",
        content: messageLogArr[i].name == tags.label ? messageLogArr[i].message : messageLogArr[i].name + ": " + messageLogArr[i].message
    })
}

//Push system messages
if (!tags.storyTellerListening) {
   aiMessageArr.push({
        role: "system",
        content: tags.basePrompt
    });
} else {
    aiMessageArr.push({
        role: "system",
        content: tags.listeningPrompt
    });
}

aiMessageArr.push({
    role: "system",
    content: "possible targets: " + targetsArr
});

aiMessageArr.push({
    role: "system",
    content: `current place: ${tags.currentStoryPlace}, possible places: ${JSON.stringify(placesArr)}`
});

console.log("aiMessageArr", aiMessageArr);

return aiMessageArr;