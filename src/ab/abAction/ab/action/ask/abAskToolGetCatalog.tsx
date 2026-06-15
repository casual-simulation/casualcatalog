const askContext: ABAskContext | undefined = that?.askContext;

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
        // Anchor placement around ab itself so the new catalog appears near
        // the agent doing the work. Fall back to the grid focus if ab can't
        // be located.
        const abBot = ab.links.manifestation?.links?.abBot;
        const isMap = configBot.tags.mapPortal ? true : false;
        const dimension = abBot
            ? (configBot.tags.gridPortal ?? configBot.tags.mapPortal ?? 'home')
            : (ab.links.remember.tags.abGridFocus?.dimension ?? 'home');
        const centerX = abBot
            ? (abBot.tags[dimension + 'X'] ?? 0)
            : (ab.links.remember.tags.abGridFocus?.position?.x ?? 0);
        const centerY = abBot
            ? (abBot.tags[dimension + 'Y'] ?? 0)
            : (ab.links.remember.tags.abGridFocus?.position?.y ?? 0);

        // Catalog mesh is 2x3 — bump radii to give it breathing room beyond
        // the default 3/5 used by smaller bots.
        const openPos = ab.links.utils.findOpenPositionAround({
            center: new Vector2(centerX, centerY),
            dimension: dimension,
            innerRadius: isMap ? 0.0001 : 5,
            radius: isMap ? 0.0005 : 8,
            spacing: isMap ? 0.0005 : 1,
        });

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
                                position: { x: openPos.x, y: openPos.y },
                            },
                        },
                    },
                    dependencies: [{ askID: 'studioCatalog' }],
                },
                space: 'local',
            });

            const name = askContext
                ? thisBot.abAskHelperGetAgentName({ askContext })
                : ab.links.personality.tags.abBuilderIdentity;
            const avatar = askContext
                ? thisBot.abAskHelperGetAgentAvatar({ askContext })
                : undefined;

            ab.links.utils.abLog({
                name,
                avatar,
                message: `No studio catalog was loaded — spawned a user studio catalog.`,
                space: 'shared',
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
