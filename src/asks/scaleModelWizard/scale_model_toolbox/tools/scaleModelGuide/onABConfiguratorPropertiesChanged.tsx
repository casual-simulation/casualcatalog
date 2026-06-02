const { propertyValues } = that;


if ('prompt' in propertyValues) {
    tags.userPrompt = propertyValues.prompt;
    if (propertyValues.prompt) {
        //thisBot.generatePlan(propertyValues.prompt);
        await thisBot.useTodoPlan(propertyValues.prompt);
    }
}