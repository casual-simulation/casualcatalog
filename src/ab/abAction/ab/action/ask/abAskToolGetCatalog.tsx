const catalogArr = [];

// Possible kits come from every studioCatalog bot's `toolbox_array`, plus the
// global default in `ab.links.remember.tags.toolbox_array`. Two studios may
// list a toolbox with the same `name` but different contents, so dedupe by
// (studioId, name) — same name from different studios is kept as distinct.
const studioCatalogs = getBots(byTag("abArtifactName", "studioCatalog"));
const possibleToolboxes = [];
const seenToolboxKeys = new Set();

const collectToolboxes = (arr, studioId) => {
    if (!arr) return;
    for (const tb of arr) {
        if (!tb || !tb.name) continue;
        const key = `${studioId ?? ''}::${tb.name}`;
        if (seenToolboxKeys.has(key)) continue;
        seenToolboxKeys.add(key);
        possibleToolboxes.push({ toolbox: tb, studioId: studioId ?? null });
    }
};

for (const catalog of studioCatalogs) {
    collectToolboxes(catalog.tags.toolbox_array, catalog.tags.studioId);
}
collectToolboxes(ab.links.remember.tags.toolbox_array, null);

// Kits in the scene are bots from the `kit` artifact. Their `label` matches the
// toolbox `title` they were spawned from, and `studioId` matches the catalog
// they were spawned from. Match on the (studioId, label) pair.
const loadedKits = getBots(byTag("abArtifactName", "kit"));
const loadedKitKeys = new Set();
for (const kitBot of loadedKits) {
    if (kitBot.tags.label) {
        loadedKitKeys.add(`${kitBot.tags.studioId ?? ''}::${kitBot.tags.label}`);
    }
}

for (let i = 0; i < possibleToolboxes.length; i++) {
    const { toolbox: activeToolbox, studioId } = possibleToolboxes[i];
    const displayName = activeToolbox.title ?? activeToolbox.name;

    if (loadedKitKeys.has(`${studioId ?? ''}::${displayName}`)) continue;

    const obj = {
        "type": "kit",
        "name": displayName,
        "id": activeToolbox.name,
        "studioId": studioId,
        "description": activeToolbox.description ?? displayName
    }
    catalogArr.push(obj);
}

// Tools inherit their `studioId` from the kit bot they live in. Same tool from
// two different studios is kept as distinct entries — dedupe on (studioId, id).
const seenToolKeys = new Set();
for (let j = 0; j < loadedKits.length; ++j) {
    const kitBot = loadedKits[j];
    const kitStudioId = kitBot.tags.studioId ?? null;
    const arr = kitBot.tags.tool_array ?? [];
    for (let k = 0; k < arr.length; ++k) {
        const id = arr[k].targetAB;
        const key = `${kitStudioId ?? ''}::${id}`;
        if (seenToolKeys.has(key)) continue;
        seenToolKeys.add(key);

        const toolName = arr[k].name ?? arr[k].targetAB;
        const obj = {
            "type": "tool",
            "name": toolName,
            "id": id,
            "studioId": kitStudioId,
            "description": arr[k].description ?? toolName,
            "agentReady": arr[k].agentReady ?? false
        }
        catalogArr.push(obj);
    }
}

return catalogArr;
