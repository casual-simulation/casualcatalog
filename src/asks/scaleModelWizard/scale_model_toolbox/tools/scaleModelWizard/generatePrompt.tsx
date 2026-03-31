const prompt = that;
tags.originalPrompt = that;

if (!prompt) {
    return;
}

configBot.tags.menuPortal = "scaleModelWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "generating detailed prompt",
    scaleModelWizardLoading: true
});

const basePrompt = tags.genPrompt;
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
        await os.sleep(500);
        thisBot.generateFromPrompt(response.content);
    }  
} catch (e) {
    os.toast("Error generating prompt. Please try again", 8);
    console.log("Error generating prompt. Please try again", e);
    destroy(loadingBar);
}

if (loadingBar) {
    destroy(loadingBar);
}