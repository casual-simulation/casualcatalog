const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";

//Grab elements
const targetsArr = [];
const targets = getBots("storyElement");
for (const bot of targets) {
    targetsArr.push({
        label: bot?.tags?.label,
        positionX: bot?.tags[currentDim + 'X'],
        positionY: bot?.tags[currentDim + 'Y'],
        positionZ: bot?.tags[currentDim + 'Z'],
        color: bot?.tags.color,
        scaleX: bot?.tags.scaleX,
        scaleY: bot?.tags.scaleY,
        scaleZ: bot?.tags.scaleZ
    });
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
aiMessageArr.push({
    role: "system",
    content: tags.basePrompt
});

aiMessageArr.push({
    role: "system",
    content: "possible targets: " + JSON.stringify(targetsArr)
});

aiMessageArr.push({
    role: "system",
    content: `current place: ${tags.currentStoryPlace}`
});

aiMessageArr.push({
    role: "system",
    content: `position units are: ${currentPortal == "map" ? "longitude, latitude" : "yards"}`
});

console.log("aiMessageArr", aiMessageArr);

return aiMessageArr;