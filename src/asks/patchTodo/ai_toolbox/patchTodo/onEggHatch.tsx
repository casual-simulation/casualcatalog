if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

tags.formAddress = ab.abBuildCasualCatalogURL("/asks/meshes/toDoBot_checklist_animated.glb");

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
    
    tags.abIgnore = true;
    tags.abPatchBotInstance = true;
    tags.abPatchAskInput = `🧬${JSON.stringify(that.eggParameters?.askInput)}`;

    tags.alwaysApprove = that.eggParameters?.alwaysApprove ?? false;
} 

thisBot.handleAnimationState("incomplete_in");