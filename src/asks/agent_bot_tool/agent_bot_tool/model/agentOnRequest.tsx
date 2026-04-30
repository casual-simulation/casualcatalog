thisBot.agentReset({ keepArm: true });

let inquiry = that.inquiry ?? that;
const todoBotId = that?.todoBotId;
const attachments = that?.attachments;

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
    const openPosition = ab.links.utils.findOpenPositionAround({
        center: getBotPosition(thisBot, tags.dimension),
        radius: 3,
        dimension: tags.dimension,
        spacing: 1,
        direction: 'outward',
    })

    if (openPosition) {
        patchBotPosition = openPosition;
    }
}

// By default store the conversation history for this agent bot, but if it's working 
// on a todo bot then store the history on the abRemember bot so it can be accessed by 
// other agents working on the same todo bot.
const historyStorageBot = todoBotId ? ab.links.remember : thisBot;

abAskBot.askGPT({
    inquiry,
    attachments,
    menuType: tags.menuType,
    model: tags.aiModel,
    abBot: thisBot,
    sourceId: thisBot.id,
    abDimension: tags.dimension,
    abPosition: patchBotPosition,
    menuActionData: data,
    todoBot: todoBotId,
    historyStorageBot
})

// Wait some amount of time before bringing bot label back.
await os.sleep(1600 + 250);
tags.label = prevLabel;