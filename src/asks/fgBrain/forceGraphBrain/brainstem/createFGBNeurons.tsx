// thisBot.importForceGraph();
console.log("createFGBNeurons: ", that);

const dimension = that.dimension ? that.dimension : tags.brainDimension;
const neuronMods = that.neuronMods ? that.neuronMods : tags.defaultNeurons;
const tempNeurons = that.tempNeurons;
const neuronsColor = that.neuronsColor;
const neurons = [];

function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
};

for (const modSet in neuronMods) {
    let visible = true;
    if (thisBot.tags.hidden == true) {
        visible = false;
    }
    else if (thisBot.tags.hidden == false) {
        visible = true;
    }
    console.log("FGBNeuron visible:", visible);

    let baseNeuron = {
        space: tempNeurons ? "tempLocal" : "shared",
        [dimension]: visible,
        system: "fgbNeuron",
        brainDimension: dimension,
        toggleNeuronVisibility: `@ if(that == "show"){ tags[tags.brainDimension] = true } else if(that == "hide"){ tags[tags.brainDimension] = false }`,
        home: tags.debugMode ? true : false,
        fgbNeuron: true,
        stemID: links.altBrain ? links.altBrain.id : thisBot.id,
        forceGraph: 'fgb' + thisBot.id,
        onCreate: `@
        if(!tags.lineTo){
            await os.sleep(100);
            const connections = [];
            if(tags.stemConnected){
                connections.push(tags.stemID)
            }
            for(const topic of tags.linkedTopics){
                let topicBot = getBot(byTag("topic", topic), byTag("stemID", tags.stemID));
                topicBot.id ? connections.push(topicBot.id) : null;
            }
            tags.lineTo = connections;
        }
        `,
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

    baseNeuron[dimension] = visible;

    for (const mod in neuronMods[modSet]) {
        baseNeuron[mod] = neuronMods[modSet][mod];
    };

    baseNeuron.label = baseNeuron.topic ? baseNeuron.topic : "undefined";
    baseNeuron.color = neuronsColor ? neuronsColor : getRandomHexColor();

    neurons.push(baseNeuron);
}

console.log("FGBNeurons", neurons);
let newNeurons = create(neurons);

// let existingNeurons = links.neurons;

// if(existingNeurons){
//     if(Array.isArray(existingNeurons)){
//         let foundBots = []
//     }
//     else{
//         let foundBot = getBot(byID(existingNeurons.id));
//         if(foundBot){

//         }
//     }

//     existingNeurons = Array.isArray(existingNeurons) ? existingNeurons.concat(newNeurons) : [existingNeurons].concat(newNeurons);
// }
// else {
//     const neuronsLink = getLink(newNeurons);
//     tags.neurons = neuronsLink;
// }

that.delayLinking == true ? null : thisBot.resetNeuronsLink();

await os.sleep(150);
simManager.start(tags.forceGraph);