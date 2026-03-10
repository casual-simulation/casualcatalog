masks.gptActive = true;

const userMessage = that;

const model = tags.aiModel;
const contextualPrompt = tags.prompt;

const systemPrompt = tags.corePrompt + " " + contextualPrompt + ". User message: " + userMessage;

const aiResp = await ai.chat(systemPrompt, {
    model: model ?? "claude-3-5-sonnet-latest",
    temperature: 0,
    topP: 1,
    presencePenalty: 0.6,
    frequencyPenalty: 0
});

ab.log("AI: " + aiResp);