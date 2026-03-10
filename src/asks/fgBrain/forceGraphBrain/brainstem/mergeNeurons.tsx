const topicsToMerge = Array.isArray(that.topics) ? that.topics : [];

console.log("Merging Neurons", topicsToMerge);

// console.log(`name: ${that.name}`)
// console.log("topicsToMerge", topicsToMerge)

let botsToMerge = [];
let lineTo = [];
let lineFrom = [];
let linkedTopics = [];
let details = "";

let neuronBots = links.neurons;

for (const bot of neuronBots) {
    if (topicsToMerge.includes(bot.tags.topic)) {
        botsToMerge.push(bot.id);
        lineTo = lineTo.concat(bot.tags.lineTo);
        linkedTopics.concat(bot.tags.linkedTopics);
        if (!details.includes(bot.tags.details)) {
            details.length > 0 ? details += " " : null;
            details += bot.tags.details;
        }
    }
}

for (const bot of links.neurons) {
    if (botsToMerge.some(i => bot.tags.lineTo.includes(i))) {
        lineFrom.push(bot.id);
        if (!details.includes(bot.tags.details)) {
            details.length > 0 ? details += " " : null;
            details += bot.tags.details;
        }
    }
}

botsToMerge = [...new Set(botsToMerge)];
lineTo = [...new Set(lineTo)];
lineFrom = [...new Set(lineFrom)];
linkedTopics = [...new Set(linkedTopics)];

// console.log("botsToMerge", botsToMerge)
// console.log("lineTo", lineTo)
// console.log("lineFrom", lineFrom)
// console.log("stemConnected", lineTo.includes(thisBot.id))
// console.log("linkedTopics", linkedTopics)

let mergedMods = [{
    "topic": that.name,
    "lineTo": lineTo,
    "stemConnected": lineTo.includes(thisBot.id) ? true : false,
    "linkedTopics": linkedTopics,
    "details": details
}]

// console.log("mergedMods", mergedMods)

thisBot.createFGBNeurons({ dimension: 'home', neuronMods: mergedMods, tempNeurons: true, delayLinking: true })
let newNeuronBot = getBot(byTag("label", that.name));
// console.log("newNeuronBot", newNeuronBot)

for (const bot of lineFrom) {
    let neuronBot = getBot(byID(bot));
    let botLineTo = [...new Set(neuronBot.tags.lineTo)];
    // console.log("botLineTo", botLineTo);
    let botLinkedTopics = [...new Set(neuronBot.tags.linkedTopics)];
    botLinkedTopics = botLinkedTopics.filter(e => !topicsToMerge.includes(e));
    botLinkedTopics.push(that.name);
    // console.log("lineFrom linkedTopics", botLinkedTopics);
    botLineTo = botLineTo.filter(e => !botsToMerge.includes(e));
    botLineTo.push(newNeuronBot.id);
    // console.log("botLineTo", botLineTo);
    setTag(neuronBot, "lineTo", botLineTo);
    setTag(neuronBot, "linkedTopics", botLinkedTopics);
}

destroy(botsToMerge);

thisBot.resetNeuronsLink();