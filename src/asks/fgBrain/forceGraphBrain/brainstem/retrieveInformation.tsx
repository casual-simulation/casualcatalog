const informationArray = [];

if (links.neurons != null) {
    if (Array.isArray(links.neurons)) {
        for (const neuron of links.neurons) {
            neuron ? informationArray.push({ topic: neuron.tags.topic, details: neuron.tags.details }) : null;
        }
    }
    else {
        informationArray.push({ topic: links.neurons.tags.topic, details: links.neurons.tags.details });
    }
}


return informationArray;