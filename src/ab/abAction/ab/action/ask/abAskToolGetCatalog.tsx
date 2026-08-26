const askContext: ABAskContext | undefined = that?.askContext;

const catalogArr = [];

// Loaded kit bots — their `label` matches the toolbox `title` they were
// spawned from. Used to skip already-loaded kits in the catalog response.
const loadedKits = getBots(byTag("abArtifactName", "kit"));
const loadedKitKeys = new Set();
for (const kitBot of loadedKits) {
    if (kitBot.tags.label && kitBot.tags.studioId) {
        loadedKitKeys.add(`${kitBot.tags.label}`);
    }
}

// Kit entries. Multiple studioCatalog bots can carry the same studio —
// their toolbox_arrays are equivalent, so dedupe by (studioId, kitName).
const seenKitKeys = new Set();

const toolboxes = ab.links.remember.tags.toolbox_array ?? [];
for (const tb of toolboxes) {
    if (!tb || !tb.name) continue;

    const kitKey = `${tb.name}`;
    if (seenKitKeys.has(kitKey)) continue;
    seenKitKeys.add(kitKey);

    const displayName = tb.title ?? tb.name;
    if (loadedKitKeys.has(`${displayName}`)) continue;

    catalogArr.push({
        type: 'kit',
        name: displayName,
        id: tb.name,
        description: tb.description ?? displayName,
    });
}


// Tool entries. Same dedupe by (studioId, toolId). Tools from kits whose
// studio isn't loaded as a studioCatalog are excluded.
const seenToolKeys = new Set();
for (const kitBot of loadedKits) {
    const arr = kitBot.tags.tool_array ?? [];
    for (const tool of arr) {
        const id = tool.targetAB;
        if (!id) continue;

        const toolKey = `${id}`;
        if (seenToolKeys.has(toolKey)) continue;
        seenToolKeys.add(toolKey);

        const toolName = tool.name ?? id;
        catalogArr.push({
            type: 'tool',
            name: toolName,
            id: id,
            description: tool.description ?? toolName,
            agentReady: tool.agentReady ?? false,
        });
    }
}

return catalogArr;
