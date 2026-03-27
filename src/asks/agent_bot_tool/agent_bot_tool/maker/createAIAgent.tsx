const { dimension, aiModel, aiProvider } = that;

shout("clearAiKitAgentBotMenu");

const defaultConfig = tags.agentConfigs['default'];
const providerConfig = tags.customAgentConfig ?? tags.agentConfigs[aiProvider] ?? {};

// Final agent config is default config + overrides from provider config.
const agentConfig = {
    ...defaultConfig,
    ...providerConfig
}

const botTags = {
    creator: null,
    abIDOrigin: null,
    abIgnore: true,
    aiModel,
    aiProvider,
    ai_toolbox: null,
    listening: true,
    menuColor: agentConfig.chatBarColor,
    labelColor: agentConfig.labelColor,
    armColor: agentConfig.armColor,
    armMeshPath: agentConfig.armMeshPath,
    scale: agentConfig.scale,
    agentName: agentConfig.agentName,
    system: "ai.agent." + aiModel
}

if (agentConfig.meshPath) {
    if (agentConfig.meshPath.startsWith('https://')) {
        botTags.formAddress = agentConfig.meshPath;
    } else {
        botTags.formAddress = ab.abBuildCasualCatalogURL(agentConfig.meshPath);
    }

    botTags.form = 'mesh';
    botTags.formSubtype = 'gltf';
    botTags.usingAgentMesh = true;

    const animationStateMachineMod = ab.links.manifestation.generateAnimationStateMachineMod({
        controllerName: tags.system,
        gptSourceId: null, // Defaults to using bot id.
        debugAnim: tags.debug
    })

    for (const key in animationStateMachineMod) {
        botTags[key] = animationStateMachineMod[key];
    }
} else {
    botTags.form = 'cube';
    botTags.strokeWidth = 1;
    botTags.strokeColor = agentConfig.armColor;
    botTags.color = 'clear';
}

if (agentConfig.showName) {
    botTags.label = aiModel;
    botTags.labelPosition = 'floatingBillboard';
    botTags.labelFloatingBackgroundColor = agentConfig.namePlateColor;
    botTags.labelWordWrapMode = 'none';
}

const dimensionX = thisBot.tags[dimension + 'X'] ?? 0;
const dimensionY = thisBot.tags[dimension + 'Y'] ?? 0;

botTags.dimension = dimension;
botTags[dimension] = true;
botTags[dimension + 'X'] = dimensionX;
botTags[dimension + 'Y'] = dimensionY;

if (links.agentModel) {
    const bot = create(links.agentModel, botTags);

    if (bot && tags.destroyAfterUse) {
        destroy(links.agentModel);
        destroy(thisBot);
    }

    shout('onAnyAgentBotCreated', { bot });

    return bot;
}