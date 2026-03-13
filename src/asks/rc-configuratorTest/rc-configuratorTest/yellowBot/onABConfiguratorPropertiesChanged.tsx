const { propertyValues } = that;

console.log(`[${tags.system}.${tagName}] propertyValues:`, propertyValues);

if ('yellowBotVisible' in propertyValues) {
    tags.home = propertyValues.yellowBotVisible;
}

if ('yellowBotClickMessage' in propertyValues) {
    tags.clickMessage = propertyValues.yellowBotClickMessage;
}

if ('yellowBotColorVariant' in propertyValues) {
    tags.color = propertyValues.yellowBotColorVariant.value;
}

if ('yellowBotX' in propertyValues) {
    tags.homeX = propertyValues.yellowBotX;
}

if ('yellowBotY' in propertyValues) {
    tags.homeY = propertyValues.yellowBotY;
}