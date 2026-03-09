tags.currentStoryPlace = that;

if (!tags.storyTellerListening) {
    return;
}

const aiMessageArr = await thisBot.compileMessages();

aiMessageArr.push({
    role: "system",
    content: `We have entered a new location (${that}). Announce it with a narration, and weave it into the story.`
});


thisBot.askNarrator(aiMessageArr);