if (globalThis.ab) {
    if (authBot) {
        if (ab.links.remember.tags.subscriptionsEnabled) {
            if (authBot.tags.subscriptionTier) {
                return authBot.tags.subscriptionTier !== 'FreePlay';
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
} else {
    console.error(`[${tags.system}.${tagName}] wait for ab to finish booting before querying ${tagName}.`)
    return null;
}