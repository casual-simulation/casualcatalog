import { AIChatOptions, AIChatMessage } from 'casualos';

const {
    prompt,
    inquiry,
    model,
    sourceId,
    messages,
} = that ?? {};

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that`, that);
}

if (authBot.tags.privacyFeatures.allowAI == false) {
    links.utils.abLogAndToast({ message: "AI not authorized on this account", logType: 'log' });
    return null;
}

const activeRequestSignal = create({
    space: 'tempLocal',
    abActiveRequestGPT: true,
    input: '🧬' + JSON.stringify(that),
    success: null, // Will be set when gpt request finishes.
    errorMessage: null, // Will be set if gpt request fails.
    response: null, // Will be set if gpt request succeeds.
    onCreate: ListenerString(() => {
        shout('onABRequestGPTStarted', { input: tags.input });
    }),
    onDestroy: ListenerString(() => {
        if (tags.success) {
            shout('onABRequestGPTSuccess', { input: tags.input, response: tags.response })
        } else {
            shout('onABRequestGPTFailure', { input: tags.input, success: tags.success, errorMessage: tags.errorMessage })
        }
    })
})

const busyIndicator = await links.menu.abCreateMenuBusyIndicator({abMenu: true, label: `asking ${links.personality.tags.abBuilderIdentity}` });

const aiChatOptions: AIChatOptions = { 
    preferredModel: model ?? links.personality.tags.abPreferredAIModel
}

let aiChatMessages: AIChatMessage[];

if (messages && messages.length > 0) {
    // Multi-turn: use the provided message history as-is (built by askGPT)
    aiChatMessages = messages;
} else {
    // Legacy single-turn path: build the standard [system, warmup, user] array
    aiChatMessages = [];

    aiChatMessages.push({
        role: 'system',
        content: [
            { text: prompt ? prompt : tags.prompt_core }
        ]
    })

    // The following assistant message is a hard requirement for Google Gemini models - that the "model" / "assistant" have a message before the "user" does.
    // It doesnt really hurt to do this for all the ai models though.
    aiChatMessages.push({
        role: 'assistant',
        content: [
            { text: `Thank you for that very detailed and clear explanation of the required deliverable. I will make sure to give you code that meets your expectation while making sure that the Hard Requirements are fulfilled the Hard Requirements! What would you like to ask me?` }
        ]
    })

    aiChatMessages.push({
        role: 'user',
        content: [
            { text: inquiry }
        ]
    })
}

if (!links.menu) {
    await links.learn.abAdapt('abInterface');
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] sending to ai:`, { aiChatMessages, aiChatOptions });
}

let aiResponse: AIChatMessage;

try {
    aiResponse = await ai.chat(aiChatMessages, aiChatOptions);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ai response:`, aiResponse);
    }

    assert(typeof aiResponse.content === 'string', `[${tags.system}.${tagName}] Unable to extract string response from AI response.`);

    if (aiResponse.role === 'system') {
        // CasualOS will return provider errors as a system response with the error encoded as a string prefixed with "Error: ".
        // This section tries to detect that and throw it as a proper Error if detected.
        if (aiResponse.content.startsWith('Error: ')) {
            activeRequestSignal.tags.success = false;
            activeRequestSignal.tags.errorMessage = aiResponse.content;

            throw new Error(aiResponse.content);
        }
    }

    activeRequestSignal.tags.success = true;
    activeRequestSignal.tags.response = aiResponse.content;
} catch(e) {
    aiResponse = null;

    const errorMessage = links.utils.getErrorMessage(e);

    activeRequestSignal.tags.success = false;
    activeRequestSignal.tags.errorMessage = errorMessage;

    // Show toast with error.
    links.utils.abLogAndToast({ message: `AI request failed - ${errorMessage}`, logType: 'error' });

    // Rethrow so callers can catch.
    throw e;
} finally {
    destroy(busyIndicator);
    destroy(activeRequestSignal);
}

return aiResponse?.content;