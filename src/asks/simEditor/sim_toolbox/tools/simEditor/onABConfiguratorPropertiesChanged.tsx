const { propertyValues } = that;

if ('pageID' in propertyValues) {
    tags.pageID = propertyValues.pageID;
}

if ('objective' in propertyValues) {
    tags.pageObjective = propertyValues.objective;
}

if ('bots' in propertyValues) {
    tags.pageBotData = propertyValues.bots;
}

if ('steps' in propertyValues) {
    tags.pageData = propertyValues.steps;
}

if ('prevPage' in propertyValues) {
    tags.prevPage = propertyValues.prevPage;
}

if ('nextPage' in propertyValues) {
    tags.nextPage = propertyValues.nextPage;
}