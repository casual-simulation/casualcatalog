//create askInput?
const askInput = { 
    "inquiry": that,
    "prompt": "grid", 
    "agentMode": "build", 
    "data": 
        { 
            "message": that, 
            "menu": "grid", 
            "dimension": configBot.tags.mapPortal ?? configBot.tags.gridPortal, 
            "dimensionX": -5, 
            "dimensionY": -4 
        }, 
    "sourceId": "manual" 
}

tags.abPatchAskInput = `🧬${JSON.stringify(askInput)}`;