const { propertyValues } = that;

if ('simID' in propertyValues) {
    tags.simID = propertyValues.simID;
}

if ('startingPage' in propertyValues) {
    tags.startingPage = propertyValues.startingPage;
}

if ('prompt' in propertyValues) {
    tags.wizardPrompt = propertyValues.prompt;
    if (propertyValues.prompt) {
       await thisBot.generateFromPrompt(propertyValues.prompt);
    }
}