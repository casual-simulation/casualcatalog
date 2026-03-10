const aiMessageArr = [];

const messages = getBots(byTag("consoleLogMessageBot", true), byTag("space", "shared"));
for (let i = 0; i < messages.length; ++i) {
    aiMessageArr.push({
        role: messages[i].tags.name == tags.label ? "assistant" : "user",
        content: messages[i].tags.name == tags.label ? messages[i].tags.message : messages[i].tags.name + ": " + messages[i].tags.message
    })
}

aiMessageArr.push({
    role: "system",
    content: `You are ${tags.label} in a story. With this description of what you are (${tags.elementPrompt}), continue the story with what you do or say next.
     Keep it simple and short, no more than a sentence or two, inpired by picture books, fables and fairytales. 
     You are allowed to improvise, create new plot points, and generally make the story interesting.
     You cannot speak for other story elements. Your response should be a string only.
     
     EXAMPLE SCENARIO:
     a sheep and a cow are in a field, you are the sheep. The cow says "it is a beautiful day out".

     RESPONSE: 
     "Yes! the sun is shining very brightly today! I may go on a walk."
     `
});

console.log("prompt", aiMessageArr);
return aiMessageArr;