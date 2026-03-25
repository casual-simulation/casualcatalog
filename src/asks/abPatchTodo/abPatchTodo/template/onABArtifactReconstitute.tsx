const data = that.data;

tags.abPatchAskInput = data.abPatchAskInput;
tags.alwaysApprove = data.alwaysApprove;
tags.aiModel = data.aiModel;
tags.debug = data.debug;

tags.dimension = data.dimension ?? 'home';
tags[dimension + 'X'] = data.dimensionX ?? 0;
tags[dimension + 'Y'] = data.dimensionY ?? 0;
tags[dimension + 'Z'] = data.dimensionZ ?? 0;

tags.abPatchBotInstance = true;

// Old onEggHatch code:
/** 
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (that.eggParameters) {
    const dimension = that.eggParameters?.gridInformation?.dimension ?? 'home';
    tags.dimension = dimension;
    tags[dimension] = true;
    tags[dimension + 'X'] = that.eggParameters?.gridInformation?.position?.x ?? 0;
    tags[dimension + 'Y'] = that.eggParameters?.gridInformation?.position?.y ?? 0;
    tags[dimension + 'Z'] = that.eggParameters?.gridInformation?.position?.z ?? 0;

    tags.abPatchBotIdentity = `patch ${thisBot.id.substring(0, 5)}`;
    tags.abPatchLabel = `review ${tags.abPatchBotIdentity}`;
    // tags.system = `abPatchBot.${tags.abPatchBotIdentity}`;
    
    tags.abPatchBotInstance = true;
    tags.abPatchAskInput = `🧬${JSON.stringify(that.eggParameters?.askInput)}`;

    tags.alwaysApprove = that.eggParameters?.alwaysApprove ?? false;

    tags.aiModel = abPersonality.tags.abPreferredAIModel;
} 

thisBot.handleAnimationState("incomplete_in");
*/