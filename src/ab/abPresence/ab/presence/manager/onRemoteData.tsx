if (!thisBot.getPresenceEnabled()) {
    return;
}

if (that.name === 'ab_user_presence_data') {
    const data: ABUserPresenceData | ABUserPresenceData[] = that.that;

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ab_user_presence_data data:`, data);
    }

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            thisBot.onABUserPresenceDataReceived(data[i]);
        }
    } else {
        thisBot.onABUserPresenceDataReceived(data);
    }
}