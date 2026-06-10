const recordId = that;

if (authBot) {
    return authBot.id === recordId;
} else { 
    const authBot = await os.requestAuthBotInBackground();
    return authBot?.id === recordId;
}