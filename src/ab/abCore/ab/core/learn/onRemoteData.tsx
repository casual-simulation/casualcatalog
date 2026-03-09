if (that.name === 'update_ab_reload_page') {
    const { reloadPage, dryRun } = that.that;

    if (that.remoteId === configBot.id) {
        // Wait a moment before reloading the page if we are the ones that sent out the message.
        await os.sleep(1000);
    }

    let isURL = false;

    if (typeof reloadPage === 'string') {
        try {
            new URL(reloadPage);
            isURL = true;
        } catch (e) {}
    }

    let url = isURL ? reloadPage : configBot.tags.url;

    if (dryRun) {
        console.log(`[${tags.system}.${tagName}] dry run: would go to url`, url);
        return;
    }
    
    os.goToURL(isURL ? reloadPage : configBot.tags.url);
}