const { propertyValues } = that;

if ('listBotUrls' in propertyValues) {
    tags.fileUrls = propertyValues.listBotUrls;
}

if ('listBotColorTimeline' in propertyValues) {
    tags.colorTimeline = propertyValues.listBotColorTimeline;
}
