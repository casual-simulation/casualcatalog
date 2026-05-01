thisBot.agentReset({ keepArm: true });

let inquiry = that.inquiry ?? that;
const todoBot = that?.todoBotId ? getBot('id', that.todoBotId) : undefined;
const attachments = that?.attachments;

ab.links.ask.masks.gptActive = true;

const todoFocusData = todoBot?.tags.focusMenuActionData;

const data = {
    dimension: todoFocusData?.dimension ?? that.data?.armDimension,
    dimensionX: todoFocusData?.dimensionX ?? that.data?.armDimensionX,
    dimensionY: todoFocusData?.dimensionY ?? that.data?.armDimensionY,
    bot: todoFocusData?.bot ?? links.targetBot?.id,
    bots: todoFocusData?.bots ?? that.data?.bots,
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
const historyStorageBot = todoBot ? ab.links.remember : thisBot;

ab.links.ask.askGPT({
    inquiry,
    attachments,
    menuType: tags.menuType,
    model: tags.aiModel,
    abBot: thisBot,
    sourceId: thisBot.id,
    abDimension: tags.dimension,
    abPosition: patchBotPosition,
    menuActionData: data,
    todoBot,
    historyStorageBot
})

// Wait some amount of time before bringing bot label back.
await os.sleep(1600 + 250);
tags.label = prevLabel;