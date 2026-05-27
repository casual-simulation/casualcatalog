const type: 'kit' | 'tool' = that?.args?.type;
const id: string = that?.args?.id;
const argStudioId: string = that?.args?.studioId;
const gridDimension: string = that?.args?.gridDimension ?? ab.links.remember.tags.abActiveDimension ?? 'home';
const gridPositionX: number = that?.args?.gridPositionX ?? 0;
const gridPositionY: number = that?.args?.gridPositionY ?? 0;

if (!type || !id || !argStudioId) {
    const errorMessage = `missing required args: type='${type}', id='${id}', studioId='${argStudioId}'`;
    console.error(`[${tags.system}.${tagName}] ${errorMessage}`);
    return { success: false, type, id, errorMessage };
}

const gridData = {
    dimension: gridDimension,
    position: {
        x: gridPositionX,
        y: gridPositionY,
    },
};

async function collectConfiguratorProperties(bots: Bot[]): Promise<ABConfiguratorData[]> {
    const groups: Record<string, Bot[]> = ab.links.configurator.abGetConfiguratorGroupsFromBots({ bots });
    const configuratorProperties: ABConfiguratorData[] = [];
    for (const group of Object.keys(groups)) {
        try {
            const data: ABConfiguratorData = await ab.links.configurator.abCollectConfiguratorData({ abConfiguratorGroup: group, bots: groups[group] });
            if (data) configuratorProperties.push(data);
        } catch (e) {
            // best-effort; non-fatal
        }
    }
    return configuratorProperties;
}

if (type === 'kit') {
    // Find any studioCatalog bot bound to the requested studio. Multiple
    // copies of the same studio are interchangeable — pick the first.
    const catalog = getBot(byTag("abArtifactName", "studioCatalog"), byTag("studioId", argStudioId));

    if (!catalog) {
        const errorMessage = `no studioCatalog loaded for studio '${argStudioId}'. Call getCatalog first.`;
        console.error(`[${tags.system}.${tagName}] ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }

    const toolboxData = catalog.tags.toolbox_array?.find(toolBox => toolBox.name == id || toolBox.title == id);

    if (!toolboxData) {
        const errorMessage = `kit '${id}' not found in catalog for studio '${argStudioId}'`;
        console.error(`[${tags.system}.${tagName}] ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }

    try {
        // loadKit internally awaits the kit's reconstitute, so when this
        // resolves the kit's tool_array is already populated.
        const loadResult = await catalog.loadKit({ id });

        if (loadResult && loadResult.success === false) {
            const errorMessage = loadResult.errorMessage ?? 'kit load failed';
            console.error(`[${tags.system}.${tagName}] failed to load kit ${id}. Error: ${errorMessage}`);
            return { success: false, type, id, errorMessage };
        }

        shout("abMenuRefresh");

        const catalogResult = await thisBot.abAskToolGetCatalog({ askContext: that?.askContext });
        return { success: true, type, id, alreadyLoaded: loadResult?.alreadyLoaded ?? false, catalog: catalogResult };
    } catch (e) {
        const errorMessage = ab.links.utils.getErrorMessage(e);
        console.error(`[${tags.system}.${tagName}] failed to load kit ${id}. Error: ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }
} else if (type === 'tool') {
    let isArtifact = false;

    // Find a loaded kit bot for this studio that contains the requested tool.
    const toolbox = getBot(
        byTag("tool_array", tool_arr => Array.isArray(tool_arr) && tool_arr.find(tool => tool.targetAB == id)),
        byTag("studioId", argStudioId),
    );

    if (toolbox) {
        isArtifact = toolbox.tags.tool_array.find(tool => tool.targetAB == id)?.artifact;
    }

    const toolboxBot = toolbox ? getLink(toolbox) : null;

    if (isArtifact) {
        const abArtifactShard = {
            data: {
                eggParameters: {
                    toolboxBot,
                    gridInformation: gridData,
                }
            },
            dependencies: [{ askID: id }]
        };

        try {
            const shardBots = await ab.links.artifact.abCreateArtifactPromiseBot({
                abArtifactName: id,
                abArtifactInstanceID: uuid(),
                abArtifactShard,
            });

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] loaded tool ${id}. artifact shard bots:`, shardBots);
            }

            shout("abMenuRefresh");

            const configuratorProperties = await collectConfiguratorProperties(shardBots);
            return { success: true, type, id, bots: shardBots, configuratorProperties };
        } catch (e) {
            const errorMessage = ab.links.utils.getErrorMessage(e);
            console.error(`[${tags.system}.${tagName}] failed to load tool ${id} as artifact. Error: ${errorMessage}`);
            return { success: false, type, id, errorMessage };
        }
    } else {
        try {
            const lookupResult: ABLookupAskIDResult = await ab.links.search.onLookupAskID({
                askID: id,
                sourceEvent: 'tool',
                eggParameters: {
                    toolboxBot,
                    gridInformation: gridData,
                },
            });

            shout("abMenuRefresh");

            if (lookupResult.success) {
                const configuratorProperties = await collectConfiguratorProperties(lookupResult.hatchedBots);
                return { success: true, type, id, bots: lookupResult.hatchedBots, configuratorProperties };
            } else {
                const errorMessage = lookupResult.errorMessage ?? 'lookup failed';
                console.error(`[${tags.system}.${tagName}] failed to load tool ${id}. Error: ${errorMessage}`);
                return { success: false, type, id, errorMessage };
            }
        } catch (e) {
            const errorMessage = ab.links.utils.getErrorMessage(e);
            console.error(`[${tags.system}.${tagName}] failed to load tool ${id}. Error: ${errorMessage}`);
            return { success: false, type, id, errorMessage };
        }
    }
} else {
    const errorMessage = `type '${type}' is not implemented`;
    console.error(`[${tags.system}.${tagName}] ${errorMessage}`);
    return { success: false, type, id, errorMessage };
}
