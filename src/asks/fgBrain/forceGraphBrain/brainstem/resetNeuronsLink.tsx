let allNeurons = [];

getBots(b=>{
    b.tags.fgbNeuron == true && b.tags.forceGraph == "fgb" + thisBot.id ? allNeurons.push(b) : null;
})

const neuronsLink = getLink(allNeurons);
tags.neurons = neuronsLink;

await os.sleep(120);

let neuronCopy = thisBot.copyNeurons();

if(links.neuronCopyHolder){
    setTag(links.neuronCopyHolder, "neuronCopy", neuronCopy);
};