const neuronUpdates = that;

// console.log("neurons: ", links.neurons, "neuron updates: ", neuronUpdates);

for(const update of neuronUpdates){

    // console.log("neuron update: ", update);
    if(Array.isArray(links.neurons)){
        for(const neuron of links.neurons){
            if(neuron.tags.topic == update.topic){
                setTag(neuron, "details", update.details);
            }
        }
    }
    else if(links.neurons && links.neurons.tags.topic == update.topic){
        setTag(neuron, "details", update.details);
    }
}