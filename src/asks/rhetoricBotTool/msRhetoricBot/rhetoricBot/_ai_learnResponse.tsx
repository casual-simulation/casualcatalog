let knowledgeBase = tags.knowledgeBase ?? [];

// takes a given user message and uses it to determine what information RB should add to itself
let topicPrompt = `You are an AI agent with the following knowledge base: `;
topicPrompt += JSON.stringify(knowledgeBase);
topicPrompt += ` And here is a message sent by ${that.user} in a chat you're in: "${that.message}".`;
topicPrompt += ` Your task is to update your knowledge base based on this message and return a single JSON object with the following structure:`;
topicPrompt += ` {
  "add": [ { "topic": string, "linkedTopics": string[], "stemConnected": boolean, "details": string } ],
  "merge": [ { "newName": string, "topicsToMerge": string[] } ],
  "update": [ { "topic": string, "details": string } ],
  "remove": string[]
}.`;
topicPrompt += ` 
Rules and details:
- "add" contains new topics inferred from the message.
- "merge" contains topics that should be combined into a broader or more appropriate single topic.
- "update" contains existing topics that should have their details refreshed or expanded.
- "remove" contains topic names that are outdated, redundant, or contradicted by new information.
- Each added topic must connect to at least one other topic or the knowledge core.
- You may leave any of the four arrays empty.
- Avoid exceeding 32 total topics in your knowledge base.
- Avoid putting underscores in topic names.`;

topicPrompt += ` 

Example 1:
Knowledge base: (empty)
Message: "I have a cat and a dog as my pets. I also like to run around with my dog, climb, and play baseball."
Response object:
{
  "add": [
    { "topic": "pets", "linkedTopics": [], "stemConnected": true, "details": "Jimmy has a pet cat and a pet dog." },
    { "topic": "physical activity", "linkedTopics": ["pets"], "stemConnected": true, "details": "Jimmy likes to climb and play baseball, as well as run with his dog." }
  ],
  "merge": [],
  "update": [],
  "remove": []
}`;

topicPrompt += ` 

Example 2:
Knowledge base: [
  { "topic": "gardening", "linkedTopics": ["hobbies"], "stemConnected": false, "details": "Mrs. Walters likes to garden on the weekends." },
  { "topic": "fishing", "linkedTopics": ["hobbies"], "stemConnected": false, "details": "Mrs. Walters enjoys fishing during the summer." },
  { "topic": "traveling", "linkedTopics": [], "stemConnected": true, "details": "The Walters occasionally take short trips." },
  { "topic": "hobbies", "linkedTopics": [], "stemConnected": true, "details": "Mrs. Walters has many hobbies, like gardening and fishing." }
]
Message: "My wife and I are combining our love for gardening and fishing into a new YouTube channel about outdoor adventures. We won’t be doing as many small weekend trips anymore, but we’ll travel for filming instead."
Response object:
{
  "add": [
    { "topic": "YouTube channel", "linkedTopics": ["gardening", "fishing", "traveling"], "stemConnected": true, "details": "The Walters are starting a YouTube channel about outdoor adventures." }
  ],
  "merge": [
    { "newName": "outdoor activities", "topicsToMerge": ["gardening", "fishing"] }
  ],
  "update": [
    { "topic": "traveling", "details": "The Walters will now travel mainly for filming their YouTube channel instead of taking small weekend trips." }
  ],
  "remove": ["weekend trips"]
}`;

topicPrompt += ` 

Giving anything other than a JSON object with "add", "merge", "update", and "remove" arrays as described above is considered a failure.`;


console.log("topic gathering prompt:", topicPrompt);

try {
  let learnResponse = await ai.chat(topicPrompt, {
    preferredModel: tags.aiModel
  })

  console.log("raw learnResponse", learnResponse);

  let parsedResponse = JSON.parse(learnResponse);
  parsedResponse.success = true;

  return parsedResponse;
}
catch {
  console.error("AI Chat Error.")
  return { success: false }
}