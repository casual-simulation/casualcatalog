if (!that) {
    return;
}

const changedTags = [];

for (const key in that) {
    if (tags.abPersonalityTags.includes(key)) {
        if (masks[key] !== that[key]) {
            setTagMask(thisBot, key, that[key], 'local');

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] changed '${key}' to:`, self.structuredClone(that[key]));
            }
            
            if (!changedTags.includes(key)) {
                changedTags.push(key);
            }
        }
    } else {
        console.error(`[${tag.system}.${tagName}] '${key}' is not a valid ab personality tag.`);
    }
}

if (changedTags.length > 0) {
    thisBot.vars.hasUnsavedChanges = true;
    shout('onABPersonalityChanged', { bot: thisBot, tags: changedTags });

    if (tags.autosave) {
        thisBot.abPersonalitySave();
    }
}
