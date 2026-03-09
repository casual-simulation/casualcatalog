function getNeuronInfo (neuronBot){
    let nbTopic = getTag(neuronBot, "topic");
    let nbLinkedTopics = [];
    let nbStemConnected = false;
    let nbLineTo = [...new Set(getTag(neuronBot, "lineTo"))];
    let idCheck = links.altBrain ? links.altBrain.id : thisBot.id;
    let nbDetails = getTag(neuronBot, "details");
    
    for(const line of nbLineTo){
        let lineBot = getBot(byID(line));
        if(lineBot){
            if(lineBot.id == idCheck){
                nbStemConnected = true;
            }
            else {
                nbLinkedTopics.push(getTag(lineBot, "topic"));
            }
        }
    }

    let nbInfo = {
        topic: nbTopic,
        linkedTopics: nbLinkedTopics,
        stemConnected: nbStemConnected,
        details: nbDetails
    };

    // setTag(neuronBot, "stemConnected", nbInfo.stemConnected);
    // setTag(neuronBot, "linkedTopics", nbInfo.linkedTopics);

    return nbInfo;
}

const neuronArray = [];

if (links.neurons != null) {
    if (Array.isArray(links.neurons)) {
        for (const neuron of links.neurons) {
            neuron ? neuronArray.push(getNeuronInfo(neuron)) : null;
        }
    }
    else {
        neuronArray.push(links.neurons.tags.topic);
    }
}

console.log("neuronArray", neuronArray);

return neuronArray;