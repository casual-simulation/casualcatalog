// tags[tags.brainDimension] ? setTag(links.neurons, tags.brainDimension, false) : setTag(links.neurons, tags.brainDimension, true);

// if(tags[tags.brainDimension] == true){
//     tags[tags.brainDimension] = false;
//     setTag(links.neurons, tags.brainDimension, false);
// }
// else {
//     tags[tags.brainDimension] = true;
//     setTag(links.neurons, tags.brainDimension, true);
// }

console.log("neuron toggle")

if (that == "show") {
    thisBot.tags.hidden = false;
    whisper(links.neurons, "toggleNeuronVisibility", "show");
}
else if (that == "hide") {
    thisBot.tags.hidden = true;
    whisper(links.neurons, "toggleNeuronVisibility", "hide");
}
else {
    if (thisBot.tags.hidden == true) {
        thisBot.tags.hidden = false;
        whisper(links.neurons, "toggleNeuronVisibility", "show");
    }
    else {
        thisBot.tags.hidden = true;
        whisper(links.neurons, "toggleNeuronVisibility", "hide");
    }
}