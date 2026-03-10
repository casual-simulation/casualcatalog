let knowledgeBase = tags.knowledgeBase ?? [];
knowledgeBase = JSON.parse(JSON.stringify(knowledgeBase));

console.log("knowledgeBase:", knowledgeBase);

let neuronBots = [];

let baseNeuron = {
    space: "tempLocal",
    system: "msRhetoricBot.neuron",
    home: true,
    stemID: thisBot.id,
    forceGraph: 'fg' + thisBot.id,
    linkTopics: `@ let links = shout("linkCheck", tags.linkedTopics); tags.stemConnected == true ? links.push(tags.stemID) : null; tags.lineTo = links ?? [];`,
    linkCheck: `@ if(that.includes(tags.topic)){ return thisBot.id; };`,
    removeNeuronBots: `@ destroy(thisBot);`,
    form: "circle",
    orientationMode: "billboard",
    labelPosition: "floatingBillboard",
    labelWordWrapMode: "none",
    onPointerEnter: `@ 
            let tipID = await os.tip(tags.details, null, null, 120);
            masks.tipID = tipID;
        `,
    onPointerExit: `@ os.hideTips(masks.tipID);`
};

let existingNeurons = getBots(byTag("system", "msRhetoricBot.neuron"));
if (existingNeurons.length == 0) {
    for (const neuron of knowledgeBase) {
        let extraTags = {
            label: neuron.topic,
            topic: neuron.topic,
            linkedTopics: [...neuron.linkedTopics],
            stemConnected: neuron.stemConnected,
            details: neuron.details,
            homeX: tags.homeX + 20*(Math.random()-0.5),
            homeY: tags.homeY + 20*(Math.random()-0.5)
        }
        neuronBots.push({...baseNeuron, ...extraTags})
    }

    // console.log(neuronBots);
    create(neuronBots);
    shout("linkTopics");
}

tags.forceGraph = 'fg' + thisBot.id;
tags.fgSettings = {"gravity":false,"linkDistance":3,"dimensions":3};

await os.sleep(150);
simManager.start(tags.forceGraph);