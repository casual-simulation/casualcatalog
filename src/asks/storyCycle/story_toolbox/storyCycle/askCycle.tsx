if (!that) {
    os.toast("[Story Cycle]: Could not find messages");
    return;
}

const aiChatOptions: AIChatOptions = {
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}

let response = await ai.chat(that, aiChatOptions);
response = response.content.replace(/```json\n?|```/g, '');

try {
    response = JSON.parse(response);
} catch (e) {
    console.log("Error responding as story cycle: ", e, response);
    return;
}

if (!response) {
    return;
}

console.log("[Story Cycle]: ", response);
if (Array.isArray(response)) {
    const currentDim = ab.links.remember.tags.abActiveDimension;

    for(const element of response) {
        const elBot = getBot("label", element?.label);
        if (elBot) {
            elBot.tags[currentDim + 'X'] = element?.positionX ?? elBot.tags[currentDim + 'X'];
            elBot.tags[currentDim + 'Y'] = element?.positionY ?? elBot.tags[currentDim + 'Y']; 
            elBot.tags[currentDim + 'Z'] = element?.positionZ ?? elBot.tags[currentDim + 'Z'];
            elBot.tags.label = element?.label ?? elBot.tags.label;
            elBot.tags.color = element?.color ?? elBot.tags.color;
            elBot.tags.scaleX = element?.scaleX ?? elBot.tags.scaleX;
            elBot.tags.scaleY = element?.scaleY ?? elBot.tags.scaleY;
            elBot.tags.scaleZ = element?.scaleZ ?? elBot.tags.scaleZ;
        }
    }
} else {
    console.log("[Story Cycle]: Response is not an array");
}