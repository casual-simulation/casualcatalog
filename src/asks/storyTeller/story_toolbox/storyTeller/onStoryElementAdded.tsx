if (!tags.storyTellerListening) {
    return;
}

const aiMessageArr = await thisBot.compileMessages();

aiMessageArr.push({
    role: "system",
    content: "A new story element has appeared: " + that.tags.label + ". Announce it's arrival and add it to the story."
});

thisBot.askNarrator(aiMessageArr);