// const forceGraphToolBot = getBot(byTag('abIDOrigin', 'msForceGraphTool'))

// if(!forceGraphToolBot){
//     shout("hatch", {abID: "msForceGraphTool", recordKey: "6db28ddc-1835-4fb4-8ed3-5ccf26c02217", autoHatch: true, eggParameters: {defaultBots: false, abIgnore: true}});
// }

thisBot.importForceGraph();

thisBot.tags.forceGraph = 'fgb' + thisBot.id;

const eggParameters = that.eggParameters;
console.log("FGB eggParameters:", eggParameters);

let brainDimension: String = 'fgbDimension ' + thisBot.id;
let exampleNeurons: Boolean = true;
let customNeurons: Object = [];
let hatcher = null;
let altBrain = null;
let neuronCopyHolder = null;
let fgSettings = null;

if (eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    typeof eggParameters.brainDimension == "string" ? brainDimension = eggParameters.brainDimension : null;
    eggParameters.exampleNeurons == false ? exampleNeurons = false : null;
    Array.isArray(eggParameters.customNeurons) ? customNeurons = eggParameters.customNeurons : null;
    tags.debugMode = eggParameters.debugMode == true ? true : false;
    eggParameters.hatcher ? hatcher = eggParameters.hatcher : null;
    eggParameters.altBrain ? altBrain = eggParameters.altBrain : null;
    eggParameters.neuronCopyHolder ? neuronCopyHolder = eggParameters.neuronCopyHolder : null;
    eggParameters.fgSettings ? fgSettings = eggParameters.fgSettings : null;
}

if(tags.debugMode == true){
    brainDimension = 'home';
    exampleNeurons = true;   
}

let tries = 0;
while(!getBot(byTag("system", "ms-forceGraph.botManager"))){
    if(tries > 100){
        console.error("Could not find forcegraph system in time.");
        break;
    }
    else {
        tries++;
        await os.sleep(100);
    }
}
await os.sleep(100);

thisBot.tags.brainDimension = brainDimension;
tags.debugMode ? tags.home = true : tags.home = false;
exampleNeurons == true ? thisBot.createFGBNeurons({ dimension: brainDimension, neuronMods: tags.defaultNeurons, tempNeurons: tags.debugMode}) : null;
customNeurons.length > 0 ? thisBot.createFGBNeurons({ dimension: brainDimension, neuronMods: customNeurons}) : null;

hatcher ? whisper(hatcher, "linkBrain", thisBot) : null;
console.log("sending brain link request");

if(altBrain){
    tags.transformer = altBrain;
    tags.altBrain = getLink(altBrain);
    tags[brainDimension+"X"] = 0;
    tags[brainDimension+"Y"] = 0;
    tags[brainDimension+"Z"] = -1;
    tags.scale = 0.5;
    tags.pointable = false;
    tags[brainDimension] = false;
    tags.forceGraph = null;
    thisBot.tags.hidden = true;
    setTag(links.altBrain, "forceGraph", 'fgb' + thisBot.id);
    
    let settingsTries = 0;
    while(!globalThis.simContainer['fgb' + thisBot.id]){
        settingsTries++;
        if(settingsTries>100){ console.error("FGB Sim not established within time limit."); break; }
        await os.sleep(100)
        settingsTries++;
    }
    setTag(links.altBrain, "fgSettings", fgSettings);
}
else {
    thisBot.tags[brainDimension] = true;
    tags.fgSettings = fgSettings;
}

if(neuronCopyHolder){
    tags.neuronCopyHolder = getLink(neuronCopyHolder);
}