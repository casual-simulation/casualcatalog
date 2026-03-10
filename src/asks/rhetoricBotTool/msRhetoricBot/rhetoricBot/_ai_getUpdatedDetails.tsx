let knowledgeBase = tags.knowledgeBase ?? [];

// used to get any information a neuron should be updated with from user messages
let detailsPrompt = `You are an AI agent with the following knowledge base: `;
detailsPrompt += JSON.stringify(knowledgeBase);
detailsPrompt += ` And here is a message sent by ${that.user} in a chat you're in: "${that.message}".`;
detailsPrompt += ` Only give me an array of objects to update your knowledge pool based on their message, with each object in the array matching the format of:`;
detailsPrompt += ` [ { "topic": "example_1", "details": "example details 1" }, { "topic": "example_2", "details": "example details 2" } ],`;
detailsPrompt += ` where "topic" is an existing topic you know, and "details" are the updated details of that topic, based on new information obtained from the user's message`;
detailsPrompt += ` You are allowed to return an empty array if there are not any new details to add to a topic. Details provided in each object should be noticeably updated with new information.`
detailsPrompt += ` Example: Your knowledge base includes the object { "topic": "pets", "details": "Jimmy has a pet dog and a pet cat." }. Jimmy then sends the message, "My dog Rosey scared my cat Rob today by jumping around."`;
detailsPrompt += ` An appropriate response object would be: [{ "topic": "pets", "details": "Jimmy has a pet dog named Rosey and a pet cat named Rob. Rosey likes to jump around, which sometimes scares Rob." }].`
detailsPrompt += `Returning anything other than an object array that follows the rules described is considered a failure.`;

console.log("updating details prompt:", detailsPrompt);

let detailsResponse = await ai.chat(detailsPrompt, {
    preferredModel: tags.aiModel
})

console.log("raw detailsResponse", detailsResponse);

return JSON.parse(detailsResponse);