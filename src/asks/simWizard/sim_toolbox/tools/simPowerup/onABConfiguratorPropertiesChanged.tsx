const { propertyValues } = that;

if ('prompt' in propertyValues) {
    tags.wizardPrompt = propertyValues.prompt;
    if (propertyValues.prompt) {
       await thisBot.generateFromPrompt(propertyValues.prompt);
    }
}