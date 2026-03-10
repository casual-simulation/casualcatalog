// used to turn the extracted text from a pdf file into FGB neurons to be a part of RB's memory
let topicPrompt = `You are an AI agent learning and adding topics to a force graph representation of your brain.`;
topicPrompt += `Here is the text of a pdf called ${that.name} given by a user: ${that.text}.`;
topicPrompt += ` Only Give me ONLY an array of objects to add to your knowledge pool based on the text of that pdf, with each object in the array matching the format of:`;
topicPrompt += ` [ { "topic": "example_1", "linkedTopics": [], "stemConnected": true, "details": "details_string1" }, { "topic": "example_2", "linkedTopics": ["example_1"], "stemConnected": false, "details": "details_string2" } ],`;
topicPrompt += ` where stemConnected is whether the topic extracted from the message should be connected to the core of your knowledge or not, and details is a string with details of the topic from the provided information.`;
topicPrompt += ` There should be at least one object with the name of the pdf, and all of the other objects in the array should be linked to that pdf name object.`;
topicPrompt += ` All topics should have at least one connection.`;
topicPrompt += ` Giving anything other than a javascript array of objects as described above is considered a failure.`;

console.log("topic gathering prompt:", topicPrompt);

let topicResponse = await ai.chat(topicPrompt, {
    preferredModel: tags.aiModel
})

console.log("raw topicResponse", topicResponse);

return JSON.parse(topicResponse);