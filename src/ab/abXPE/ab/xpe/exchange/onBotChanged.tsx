if (that.tags.includes('availableCredits')) {
    const data = masks.availableCredits;
    if (data) {
        if (data.userCreditsPrev != null && data.userCredits !== data.userCreditsPrev) {
            const delta = data.userCredits - data.userCreditsPrev;
            const sign = delta >= 0 ? '+' : '';
            ab.links.utils.abLog({
                name: 'Credits',
                message: `${data.userCreditsPrev.toLocaleString()} → ${data.userCredits.toLocaleString()} (${sign}${delta.toLocaleString()})`,
            });
        }
        if (data.studioId && data.studioCreditsPrev != null && data.studioCredits !== data.studioCreditsPrev) {
            const delta = data.studioCredits - data.studioCreditsPrev;
            const sign = delta >= 0 ? '+' : '';
            const instStudioConfig = await ab.links.utils.abInstStudioConfig();
            const studioName = instStudioConfig?.studioDisplayName ?? data.studioId;
            ab.links.utils.abLog({
                name: `${studioName} Credits`,
                message: `${data.studioCreditsPrev.toLocaleString()} → ${data.studioCredits.toLocaleString()} (${sign}${delta.toLocaleString()})`,
            });
        }
    }
    whisper(thisBot, 'onABXPEAvailableCreditsChanged');
}
if (that.tags.includes('creditsRefreshTimeoutMS')) {
    whisper(thisBot, 'abXPERefreshCredits');
}
