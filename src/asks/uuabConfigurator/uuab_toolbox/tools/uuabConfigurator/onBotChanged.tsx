if (that.tags.includes("uuab_onUUABLoaded")) {
    if (tags.uuab_onUUABLoaded) {
        // thisBot.createUUAB();
        if (tags.uuab_onUUABLoaded != tags.savedUUABOnLoad) {
            setTagMask(thisBot, 'unsavedChanges', true, "shared");
        } else {
            if (masks.unsavedChanges) {
                setTagMask(thisBot, 'unsavedChanges', null, "shared");
            }
        }
    }
}