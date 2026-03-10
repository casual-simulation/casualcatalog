if (tags.checkingForStickyUI) return;

tags.checkingForStickyUI = true;

const stickyAppBot = getBot("system", "stickies.app");
if (!stickyAppBot) {
    await links.search.onLookupAskID({ askID: 'stickiesApp' });
} else {
    if (tags.firstLoad) {
        tags.firstLoad = false;
        let stickyAppBot = getBot("system", "stickies.app");
        whisper(stickyAppBot, "showNoteEditor", thisBot);
        
    }  
}

tags.checkingForStickyUI = null;