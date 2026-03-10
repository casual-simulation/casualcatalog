if (tags.checkingForStickyUI) return;

tags.checkingForStickyUI = true;

const stickyAppBot = getBot("system", "stickies.app");
if (!stickyAppBot) {
    shout('onLookupABEggs', {
        abID: 'stickiesApp',
        recordKey: '73571732-44ba-4eb9-9584-fa9f5c635646',
        autoHatch: true,
    });
}

tags.checkingForStickyUI = null;