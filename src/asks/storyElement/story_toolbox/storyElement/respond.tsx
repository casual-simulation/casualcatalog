const prompt = thisBot.logPrompt();

os.tip("thinking ...");

prompt.push(
    {
        role: "assistant",
        content: "Narrator: " + that
    }
)

const aiChatOptions: AIChatOptions = {
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}
const response = await ai.chat(prompt, aiChatOptions);

if (!response) {
    return;
}

ab.log({message: response?.content, name: tags.label, space: "shared"});

return response?.content;