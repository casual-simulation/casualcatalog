console.log("initiate merge");
const model1 = that.model1;
const model2 = that.model2;

if (!model1 || !model2) {
    console.log("ScaleModel: Could not merge models");
    return;
}

const manager = getBot("timelineManager", true);
if (!manager) {
    console.log("Error generating model. Missing timeline manager", e);
    return;
}

const spawn_tick = manager.tags.currentStep;
const parent_a = tags.generatedModelData.find(item => item.name == model1.tags.modelName);
const parent_b = tags.generatedModelData.find(item => item.name == model2.tags.modelName);

const prompt = 'Parent_A: ' + JSON.stringify(parent_a) + ' \nParent_B: ' + JSON.stringify(parent_b) + ' \nSpawn_Tick: ' + spawn_tick;

if (!prompt) {
    return;
}

const basePrompt = tags.mergePrompt;
const aiChatMessages: AIChatMessage[] = [];

aiChatMessages.push({
    role: 'system',
    content: [
        { text: basePrompt}
    ]
})

aiChatMessages.push({
    role: 'assistant',
    content: [
        { text: 'hello world'}
    ]
})

aiChatMessages.push({
    role: 'user',
    content: [
        { text: prompt}
    ]
})

let chosenAIModel = 'claude-haiku-4-5';
const aiModels = configBot.tags.aiChatModels ?? [];
if (!aiModels.find(model => model.name == 'claude-haiku-4-5')) {
    chosenAIModel = abPersonality.tags.abPreferredAIModel;
}

const aiChatOptions: AIChatOptions = { 
    preferredModel: chosenAIModel
}

try {
    const response = await ai.chat(aiChatMessages, aiChatOptions);
    console.log(response);
    if (response) {
        await os.sleep(500);
        thisBot.generateFromBuilder(response.content);
    }  
} catch (e) {
    os.toast("Error generating model. Please try again", 8);
    console.log("Error generating model. Please try again", e);
}
