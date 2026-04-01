for (const listener in tags.modelListeners) {
    if (tags.modelListeners[listener].type == 'stat') {
        const stat = tags.modelListeners[listener].stat;
        if (that.tags.includes(stat)) {
            shout("on" + stat + "Changed");
        }
    }
}