if (authBot) {
    return authBot.id;
} else {
    const authBot = await os.requestAuthBotInBackground();
    return authBot?.id === recordId;
}