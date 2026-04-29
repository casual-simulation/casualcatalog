const { propertyValues } = that;

if ('greenBotFavoriteNumbers' in propertyValues) {
    tags.favoriteNumbers = propertyValues.greenBotFavoriteNumbers;
}

if ('greenBotNicknames' in propertyValues) {
    tags.nicknames = propertyValues.greenBotNicknames;
}

if ('greenBotFlags' in propertyValues) {
    tags.flags = propertyValues.greenBotFlags;
}

if ('greenBotWaypoints' in propertyValues) {
    tags.waypoints = propertyValues.greenBotWaypoints;
}

if ('greenBotTodos' in propertyValues) {
    tags.todos = propertyValues.greenBotTodos;
}

if ('greenBotContacts' in propertyValues) {
    tags.contacts = propertyValues.greenBotContacts;
}
