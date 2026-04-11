if (that.tags.includes('availableCredits')) {
    whisper(thisBot, 'onABXPEAvailableCreditsChanged');
}
if (that.tags.includes('creditsRefreshTimeoutMS')) {
    whisper(thisBot, 'abXPERefreshCredits');
}
