let knowledgeBase = tags.knowledgeBase ?? [];

// gets the ai chat response to a user's message in the chat
let responsePrompt = `You are an AI agent that responds to prompts only using information contained inside of your knowledge base: `;
responsePrompt += JSON.stringify(knowledgeBase);
responsePrompt += `. Respond to the following message from ${that.user}: "${that.message}".`;
// responsePrompt += ``;

let responseResponse = await ai.chat(responsePrompt, {
    preferredModel: tags.aiModel
});

console.log("raw responseResponse", responseResponse);

return responseResponse;