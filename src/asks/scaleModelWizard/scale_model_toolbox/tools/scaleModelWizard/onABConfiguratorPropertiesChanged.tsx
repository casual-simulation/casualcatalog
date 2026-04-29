const { propertyValues } = that;


if ('prompt' in propertyValues) {
    tags.userPrompt = propertyValues.prompt;
    if (propertyValues.prompt) {
       //thisBot.generatePlan(propertyValues.prompt);
       thisBot.useTodoPlan(propertyValues.prompt);
    }
}