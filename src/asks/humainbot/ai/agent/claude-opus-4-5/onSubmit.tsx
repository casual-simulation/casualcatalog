console.log(`[${tags.system}.${tagName}] that:`, that);

const requestData = {};
const activeDimension = that.dimension ?? configBot.tags.gridPortal;

if (links.armBot) {
    const armBot = links.armBot;
    const armDimension = armBot.tags.dimension;

    requestData.armDimension = armDimension;
    requestData.armDimensionX = armBot.tags[armDimension + "X"];
    requestData.armDimensionY = armBot.tags[armDimension + "Y"];
}

const inquiry = that.text;

const aiRequest = await thisBot.agentOnRequest({inquiry, data: requestData, model: tags.aiModel});