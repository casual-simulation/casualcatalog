thisBot.agentReset();

let inquiry = that.inquiry ?? that;

const abAskBot = ab.links.ask;

abAskBot.masks.gptActive = true;

const data = {
    dimension: that.data?.armDimension,
    dimensionX: that.data?.armDimensionX,
    dimensionY: that.data?.armDimensionY,
    bot: links.targetBot?.id,
    bots: that.data?.bots,
}

const prevLabel = tags.label;
tags.label = null;

const inMapPortal = configBot.tags.mapPortal === tags.dimension || configBot.tags.miniMapPortal === tags.dimension;
const inGridPortal = configBot.tags.gridPortal === tags.dimension || configBot.tags.miniGridPortal === tags.dimension;

// Determine where the patch bot will be placed. Default to the current position of this agent bot.
let patchBotPosition = getBotPosition(thisBot, tags.dimension);

if (!inMapPortal && inGridPortal) {
    const openPosition = thisBot.findOpenPositionAround({
        originPosition: getBotPosition(thisBot, tags.dimension),
        distance: 3,
        dimension: tags.dimension,
        interval: 1,
    })

    if (openPosition) {
        patchBotPosition = openPosition;
    }
}

abAskBot.askGPT({
    inquiry,
    prompt: tags.promptType,
    model: tags.aiModel,
    abBot: thisBot,
    sourceId: thisBot.id,
    abDimension: tags.dimension,
    abPosition: patchBotPosition,
    data,
})

// Wait some amount of time before bringing bot label back.
await os.sleep(1600 + 250);
tags.label = prevLabel;