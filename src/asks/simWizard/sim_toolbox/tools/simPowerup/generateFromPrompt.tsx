const prompt = that;
tags.userPrompt = that;

if (!prompt) {
    return;
}

configBot.tags.menuPortal = "simWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "thinking",
    simWizardLoading: true
});

const basePrompt = tags.oldPrompt;
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
        thisBot.generateFromCSV(response.content);
    }  
} catch (e) {
    os.toast("Error generating sim. Please try again", 8);
    console.log("Error generating sim. Please try again", e);
    destroy(loadingBar);
}

if (loadingBar) {
    destroy(loadingBar);
}