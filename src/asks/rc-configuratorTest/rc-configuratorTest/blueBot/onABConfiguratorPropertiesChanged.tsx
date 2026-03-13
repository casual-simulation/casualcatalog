const { propertyValues } = that;;


if ('blueBotVisible' in propertyValues) {
    tags.home = propertyValues.blueBotVisible;
}

if ('blueBotShape' in propertyValues) {
    tags.form = propertyValues.blueBotShape.value;
}

if ('blueBotInterests' in propertyValues) {
    tags.interests = propertyValues.blueBotInterests;
}

if ('blueBotHoverColor' in propertyValues) {
    tags.hoverColor = propertyValues.blueBotHoverColor;
}