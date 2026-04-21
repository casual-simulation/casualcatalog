const type: 'kit' | 'tool' = that?.args?.type;
const id: string = that?.args?.id;
const gridDimension: string = that?.args?.gridDimension ?? ab.links.remember.tags.abActiveDimension ?? 'home';
const gridPositionX: number = that?.args?.gridPositionX ?? 0;
const gridPositionY: number = that?.args?.gridPositionY ?? 0;

if (!type || !id) {
    const errorMessage = `missing required args: type='${type}', id='${id}'`;
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
    const toolboxData = ab.links.remember.tags.toolbox_array?.find(toolBox => toolBox.name == id);

    if (!toolboxData) {
        const errorMessage = `kit '${id}' not found in catalog`;
        console.error(`[${tags.system}.${tagName}] ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }

    try {
        await links.toolbox.toolbox_add({ toolboxData, gridData });
        const catalog = thisBot.abAskToolGetCatalog();
        return { success: true, type, id, catalog };
    } catch (e) {
        const errorMessage = ab.links.utils.getErrorMessage(e);
        console.error(`[${tags.system}.${tagName}] failed to load kit ${id}. Error: ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }
} else if (type === 'tool') {
    let isArtifact = false;

    // find the toolbox for this ask, to determine if its an artifact
    const toolbox = getBot(byTag("tool_array", tool_arr => {
        if (tool_arr.find(tool => tool.targetAB == id)) {
            return true;
        }
    }));

    if (toolbox) {
        isArtifact = toolbox.tags.tool_array.find(tool => tool.targetAB == id)?.artifact;
    }

    if (isArtifact) {
        const abArtifactShard = {
            data: {
                eggParameters: {
                    toolboxBot: null,
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
                    toolboxBot: null,
                    gridInformation: ab.links.remember.tags.abGridFocus
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
