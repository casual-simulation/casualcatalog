const { dimension, aiModel, aiProvider, customAgentConfig, ownerId } = that;

// Every agent is owned by a user. The manager passes the owning todo's ownerId; manual creation
// (configurator / egg hatch) leaves it undefined so it falls back to the creating user. ownerId
// is what scopes onAgentTick / onABTodoExecutorChanged so each user only drives their own agents.
const agentOwnerId = ownerId ?? authBot?.id;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

shout("clearAiKitAgentBotMenu");

const defaultConfig: ABAgentConfig = tags.agentConfigs['default'];
const providerConfig: ABCustomAgentConfig = customAgentConfig ?? tags.eggAgentConfig ?? tags.agentConfigs[aiProvider] ?? {};

// Final agent config is default config + overrides from provider config.
const agentConfig: ABAgentConfig = {
    ...defaultConfig,
    ...providerConfig
}

const botTags = {
    creator: null,
    abIDOrigin: null,
    abIgnore: true,
    ownerId: agentOwnerId,
    aiModel,
    aiProvider,
    ai_toolbox: null,
    listening: true,
    menuColor: agentConfig.chatBarColor,
    labelColor: agentConfig.labelColor,
    armColor: agentConfig.armColor,
    armMeshPath: agentConfig.armMeshPath,
    avatar: agentConfig.avatar,
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
    botTags.label = agentConfig.agentName ?? aiModel;
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
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] create bot with tags:`, botTags);
    }

    const bot = create(links.agentModel, botTags);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] created bot:`, bot);
    }

    if (bot && tags.destroyAfterUse) {
        destroy(links.agentModel);
        destroy(thisBot);
    }

    shout('onAnyAgentBotCreated', { bot });

    return bot;
}