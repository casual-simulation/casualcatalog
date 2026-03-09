let prompt;

if (that) {
    prompt = that.prompt;
} else {
    prompt = await os.showInput("", {
        title: "What would you like to add to this story?"
    });
}

if (!prompt) {
    return;
}

configBot.tags.menuPortal = "storyElementLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "Generating story element",
    storyElementLoading: true
});

const aiChatOptions: AIChatOptions = {
    preferredModel: ab.links.personality.tags.abPreferredAIModel
}

let response = await ai.chat([
    {
        role: "system",
        content: tags.basePrompt
    },
    {
    role: 'assistant',
    content: [
        { text: 'hello world'}
    ]},
    {
        role: "user",
        content: prompt
    }
], aiChatOptions)

destroy(loadingBar);

response = response.content.replace(/```json\n?|```/g, '');

try {
    response = JSON.parse(response);
} catch (e) {
    console.log("Error generating story block: ", e, response);
    return;
}

if (!response) {
    return;
}

const activeDimension = configBot.tags.gridPortal;
tags.color = response?.color;
tags.label = that?.target ?? response?.name;
tags.elementPrompt = prompt;
tags.elementQuip = response?.expression;
tags[activeDimension] = true;
tags.scaleX = response?.scale?.x;
tags.scaleY = response?.scale?.y;
tags.scaleZ = response?.scale?.z;
tags.storyElementType = response?.categorization;

shout("onStoryElementAdded", thisBot);