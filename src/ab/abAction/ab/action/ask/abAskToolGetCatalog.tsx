const catalogArr = [];

// Ensure at least one studioCatalog exists in the grid. If none, auto-spawn
// a user-studio catalog bound to authBot (mirrors handleCatalogSetup's
// first-run behavior). Agents work strictly through studioCatalog bots —
// no direct access to ab.links.remember.tags.toolbox_array.
let studioCatalogs = getBots(byTag("abArtifactName", "studioCatalog"));
if (studioCatalogs.length === 0) {
    if (!authBot) {
        await os.requestAuthBotInBackground();
    }

    if (authBot) {
        const gridFocus = ab.links.remember.tags.abGridFocus;
        const dimension = gridFocus?.dimension ?? 'home';
        const positionX = gridFocus?.position?.x ?? 0;
        const positionY = gridFocus?.position?.y ?? 0;

        try {
            // abCreateArtifactPromiseBot awaits reconstitution internally.
            await ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: 'studioCatalog',
                abArtifactInstanceID: uuid(),
                abArtifactShard: {
                    data: {
                        studioId: authBot.id,
                        label: 'user studio catalog',
                        autoLoadCasualKit: true,
                        eggParameters: {
                            toolboxBot: null,
                            gridInformation: {
                                dimension: dimension,
                                position: { x: positionX, y: positionY },
                            },
                        },
                    },
                    dependencies: [{ askID: 'studioCatalog' }],
                },
            });
        } catch (e) {
            console.error(`[${tags.system}.${tagName}] failed to auto-spawn studioCatalog. Error:`, ab.links.utils.getErrorMessage(e));
        }

        studioCatalogs = getBots(byTag("abArtifactName", "studioCatalog"));
    }
}

// Track studioIds backed by a studioCatalog bot in the grid. Kits/tools
// whose studioId isn't in this set were loaded outside the catalog flow
// and should be hidden from the agent.
const knownStudioIds = new Set();
for (const catalog of studioCatalogs) {
    if (catalog.tags.studioId) knownStudioIds.add(catalog.tags.studioId);
}

// Loaded kit bots — their `label` matches the toolbox `title` they were
// spawned from. Used to skip already-loaded kits in the catalog response.
const loadedKits = getBots(byTag("abArtifactName", "kit"));
const loadedKitKeys = new Set();
for (const kitBot of loadedKits) {
    if (kitBot.tags.label && kitBot.tags.studioId) {
        loadedKitKeys.add(`${kitBot.tags.studioId}::${kitBot.tags.label}`);
    }
}

// Kit entries. Multiple studioCatalog bots can carry the same studio —
// their toolbox_arrays are equivalent, so dedupe by (studioId, kitName).
const seenKitKeys = new Set();
for (const catalog of studioCatalogs) {
    const studioId = catalog.tags.studioId;
    if (!studioId) continue;

    const toolboxes = catalog.tags.toolbox_array ?? [];
    for (const tb of toolboxes) {
        if (!tb || !tb.name) continue;

        const kitKey = `${studioId}::${tb.name}`;
        if (seenKitKeys.has(kitKey)) continue;
        seenKitKeys.add(kitKey);

        const displayName = tb.title ?? tb.name;
        if (loadedKitKeys.has(`${studioId}::${displayName}`)) continue;

        catalogArr.push({
            type: 'kit',
            name: displayName,
            id: tb.name,
            studioId: studioId,
            description: tb.description ?? displayName,
        });
    }
}

// Tool entries. Same dedupe by (studioId, toolId). Tools from kits whose
// studio isn't loaded as a studioCatalog are excluded.
const seenToolKeys = new Set();
for (const kitBot of loadedKits) {
    const studioId = kitBot.tags.studioId;
    if (!studioId || !knownStudioIds.has(studioId)) continue;

    const arr = kitBot.tags.tool_array ?? [];
    for (const tool of arr) {
        const id = tool.targetAB;
        if (!id) continue;

        const toolKey = `${studioId}::${id}`;
        if (seenToolKeys.has(toolKey)) continue;
        seenToolKeys.add(toolKey);

        const toolName = tool.name ?? id;
        catalogArr.push({
            type: 'tool',
            name: toolName,
            id: id,
            studioId: studioId,
            description: tool.description ?? toolName,
            agentReady: tool.agentReady ?? false,
        });
    }
}

return catalogArr;
