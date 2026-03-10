if (!tags.storyTellerListening) {
    return;
}

if (that?.tags?.name === tags.label) {
    return;
}

const aiMessageArr = await thisBot.compileMessages();

thisBot.askNarrator(aiMessageArr);