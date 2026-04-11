if (that.tags.includes('availableCredits')) {
    console.log(`available credits changed`, masks.availableCredits);
    whisper(thisBot, 'onABXPEAvailableCreditsChanged');
}
if (that.tags.includes('creditsRefreshTimeoutMS')) {
    whisper(thisBot, 'abXPERefreshCredits');
}
