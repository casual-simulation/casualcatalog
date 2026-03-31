const prompt = that;
tags.userPrompt = that;

if (!prompt) {
    return;
}

configBot.tags.menuPortal = "scaleModelWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "thinking",
    scaleModelWizardLoading: true
});

const basePrompt = tags.basePrompt;
const aiChatMessages: AIChatMessage[] = [];

aiChatMessages.push({
    role: 'system',
    content: [
        { text: basePrompt }
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
        { text: 'prompt: ' + prompt}
    ]
})

const aiChatOptions: AIChatOptions = { 
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}

try {
    const response = await ai.chat(aiChatMessages, aiChatOptions);
    console.log(response);
    if (response) {
        thisBot.generateFromJSON(response.content);
    }  
} catch (e) {
    os.toast("Error generating scale model. Please try again", 8);
    console.log("Error generating scale model. Please try again", e);
    destroy(loadingBar);
}

if (loadingBar) {
    destroy(loadingBar);
}