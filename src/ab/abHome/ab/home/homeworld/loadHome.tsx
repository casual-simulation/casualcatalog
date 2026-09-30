if (tags.loadingHome) {
    return;
}

masks.loadingHome = true;

await ab.links.search.onLookupABEggs({recordKey: configBot.tags.studio ?? authBot.id, abID: 'home', autoHatch: true, sourceEvent: 'ask'});

masks.loadingHome = null;