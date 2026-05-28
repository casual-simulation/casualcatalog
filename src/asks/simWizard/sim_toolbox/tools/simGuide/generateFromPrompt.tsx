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
    // const response = await ai.chat(aiChatMessages, aiChatOptions);
    // console.log(response);
    // if (response) {
    //     thisBot.generateFromCSV(response.content);
    // }  

    const chatStream = await ai.stream.chat(aiChatMessages, aiChatOptions);

    const contentChunks: string[] = [];
    let streamRole: string;

    const processNext = async (iter: AsyncIterator<any>): Promise<void> => {
        const { value: message, done } = await iter.next();
        if (done) return;
        if (message.role) {
            streamRole = message.role;
        }
        if (message.content) {
            contentChunks.push(message.content);
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] response chunk received...`);
            }
            if (typeof onPartialResponse === 'function') {
                onPartialResponse(message);
            }
        }
        await processNext(iter);
    };
    await processNext(chatStream[Symbol.asyncIterator]());

    let aiResponse = {
        role: streamRole ?? 'assistant',
        content: contentChunks.join('')
    };

    if (aiResponse) {
        thisBot.generateFromCSV(aiResponse.content);
    }  
} catch (e) {
    os.toast("Error generating sim. Please try again", 8);
    console.log("Error generating sim. Please try again", e);
    destroy(loadingBar);
}

if (loadingBar) {
    destroy(loadingBar);
}