const prompt = that.name;

if (!prompt) {
    return;
}

configBot.tags.menuPortal = "scaleModelWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "generating model: " + prompt,
    scaleModelWizardLoading: true
});

const basePrompt = tags.builderPrompt;
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
        { text: 'target: ' + prompt + "\n manifest: " + JSON.stringify(tags.parsedOriginalResponse)}
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
        thisBot.generateFromBuilder(response.content);
    }  
} catch (e) {
    os.toast("Error generating prompt. Please try again", 8);
    console.log("Error generating prompt. Please try again", e);
    destroy(loadingBar);
}

if (loadingBar) {
    destroy(loadingBar);
}