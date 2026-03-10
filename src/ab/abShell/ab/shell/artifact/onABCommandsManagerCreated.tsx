let abCommands: ABCommandsManager = that;

abCommands.addCommand('printartifactexperience', (args) => {
    const instanceDocs = thisBot.vars.instanceDocs;

    let allExperience = {};

    for (let abArtifactInstanceID in instanceDocs) {
        const experienceMap = instanceDocs[abArtifactInstanceID].experienceMap;
        const experienceJSON = JSON.parse(JSON.stringify(experienceMap.toJSON()));
        allExperience[abArtifactInstanceID] = experienceJSON;
    }

    console.log(`[printartifactexperience] All current artifact instance experience states:`, allExperience);
}, {
    shortDescription: 'Print all currently loaded artifact instance experience states to the console.',
    usage: ['.printartifactexperience']
});