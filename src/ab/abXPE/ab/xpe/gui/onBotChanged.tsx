if (that.tags.some(t => t === 'creditsRefreshTimeoutMS' || t === 'debug')) {
    thisBot.abStartCreditsRefreshCycle();
}