let knowledgeBase = tags.knowledgeBase ?? [];

// takes a given user message and uses it to determine what information RB should add to itself
let topicPrompt = `You are an AI agent with the following knowledge base: `;
topicPrompt += JSON.stringify(knowledgeBase);
topicPrompt += ` And here is a message sent by ${that.user} in a chat you're in: "${that.message}".`;
topicPrompt += ` Only give me an array of objects to add to your knowledge base based on their message, with each object in the array matching the format of:`;
topicPrompt += ` [ { "topic": "example_1", "linkedTopics": [], "stemConnected": true, "details": "example details 1" }, { "topic": "example_2", "linkedTopics": ["example_1"], "stemConnected": false, "details": "example details 2" } ],`;
topicPrompt += ` where stemConnected is whether the topic extracted from the message should be connected to the core of your knowledge or not, and details are strings of accopanying details for that topic found within the message.`;
topicPrompt += ` All topics should have at least one connection, either to other topics or to your information core.`;
topicPrompt +=  ` It is acceptable to return an empty array if there is no new information to be added. Keep topics in your knowledge base broad, and avoid having more than 32 topics inside of your knowledge base.`
topicPrompt += ` Example 1: Your knowledge base is empty, and a user named Jimmy sends the message "I have a cat and a dog as my pets. I also like to run around with my dog, climb, and play baseball." An appropriate response object would be:`
topicPrompt += ` [{ "topic": "pets", "linkedTopics": [], "stemConnected": true, "details": "Jimmy has a pet cat and a pet dog." }, { "topic": "physical activity", "linkedTopics": ["pets"], "stemConnected": true, "details": "Jimmy likes to climb and play baseball, as well as run with his dog." }].`
topicPrompt += ` Example 2: Your knowledge base contains: [{ "topic": "gardening", "linkedTopics": ["hobbies"], "stemConnected": false, "details": "Mrs. Walters likes to garden on the weekends." }, { "topic": "hobbies", "linkedTopics": [], "stemConnected": true, "details": "Mrs. Walters has lots of hobbies, like fishing and doing puzzles." }].`
topicPrompt += ` A user named Mr. Walters sends the message: "My wife, Mrs. Walters, and I are going on a fishing trip this weekend." An appropritate response object would be: [{ "topic": "traveling", "linkedTopics": ["hobbies"], "stemConnected": true, "details": "Mr and Mrs Walters are going to be going on a fishing trip soon." }].`
topicPrompt += ` Giving anything other than a javascript array of objects as described above is considered a failure.`;

console.log("topic gathering prompt:", topicPrompt);

let topicResponse = await ai.chat(topicPrompt, {
    preferredModel: tags.aiModel
})

console.log("raw topicResponse", topicResponse);

return JSON.parse(topicResponse);