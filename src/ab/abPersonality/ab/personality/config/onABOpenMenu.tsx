if (!tags.personalityLoaded) {
    if (!authBot) {
        try { 
            await os.requestAuthBotInBackground();
        } catch {
            return;
        }
    }
}