const { propertyValues } = that;

if ('simID' in propertyValues) {
    tags.simID = propertyValues.simID;
}

if ('prompt' in propertyValues) {
    tags.wizardPrompt = propertyValues.prompt;
    if (propertyValues.prompt) {
       await thisBot.generateFromPrompt(propertyValues.prompt);
    }
}