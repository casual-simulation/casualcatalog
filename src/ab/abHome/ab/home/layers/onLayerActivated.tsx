if (links.learn.abIsPrimary()) {
    if (!tags.activeInsts) {
        setTagMask(thisBot, "activeInsts", []);
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] inst: ${os.getCurrentInst()}, primary ab that:`, that);
    }

    if (!tags.activeInsts.includes(that)) {
        masks.activeInsts.push(that);

        thisBot.updateLayersMenuDropdown();
    }
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] inst: ${os.getCurrentInst()}, non-primary ab superShout 'getLayerLoadStudio'`);
    }

    superShout("getLayerLoadStudio", os.getCurrentInst());
}

