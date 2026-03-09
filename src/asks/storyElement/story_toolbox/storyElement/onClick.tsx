if (that?.modality == 'mouse' && that?.buttonId == 'right') {
    thisBot.generateStoryElementEditMenu();
    return;
}

if (!tags.elementPrompt) {
    thisBot.aiGenerateStoryElement();
    return;
}

if (!ab.links.console.masks.open) {
    whisper(ab.links.console, "showConsole");
    ab.links.console.masks.open = true;
}

os.tip("thinking...", null, null, 4);

const prompt = thisBot.logPrompt();

const aiChatOptions: AIChatOptions = {
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}

let response = await ai.chat(prompt, aiChatOptions);

if (!response) {
    return;
}

ab.log({message: response?.content, name: tags.label, space: "shared"});
// thisBot.aiGenerateStoryElement();