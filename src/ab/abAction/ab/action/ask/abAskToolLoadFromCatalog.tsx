const type: 'kit' | 'tool' = that?.args?.type;
const id: string = that?.args?.id;
const argStudioId: string | null = that?.args?.studioId ?? null;
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
    // Find the toolbox in the catalog. studioId present → that studio's
    // studioCatalog bot. studioId absent → the global remember catalog.
    let toolboxData;
    if (argStudioId) {
        const catalog = getBot(byTag("abArtifactName", "studioCatalog"), byTag("studioId", argStudioId));
        toolboxData = catalog?.tags.toolbox_array?.find(toolBox => toolBox.name == id);
    } else {
        toolboxData = ab.links.remember.tags.toolbox_array?.find(toolBox => toolBox.name == id);
    }

    if (!toolboxData) {
        const errorMessage = `kit '${id}' not found in catalog`;
        console.error(`[${tags.system}.${tagName}] ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }

    const studioId = argStudioId;
    const expectedLabel = toolboxData.title ?? toolboxData.name;

    // Wait for the kit's reconstitute before reading the catalog, otherwise
    // the kit's tool_array won't be populated yet. Listen before triggering
    // the lookup to avoid missing the event. Timeouts are soft-handled.
    const reconstitutionPromise = ab.links.utils.awaitArtifactReconstitution({
        matchSuccess: (e) => {
            return e?.abArtifactName === 'kit' && e?.shardBots?.some((b) => {
                return b?.tags?.label === expectedLabel &&
                    (b?.tags?.studioId ?? null) === (studioId ?? null);
            });
        },
        matchFailure: (e) => {
            return e?.abArtifactName === 'kit';
        },
        timeoutMs: 15000,
    }).catch(e => {
        if (e?.timedOut) {
            console.warn(`[${tags.system}.${tagName}] kit ${id} reconstitute did not arrive within timeout; returning catalog as-is.`);
            return null;
        }
        throw e;
    });

    try {
        const lookupResult: ABLookupAskIDResult = await ab.links.search.onLookupAskID({
            askID: id,
            eggParameters: {
                studioId,
                gridInformation: {
                    toolbox_name: expectedLabel,
                    ...gridData,
                },
            },
        });

        if (lookupResult && lookupResult.success === false) {
            const errorMessage = lookupResult.errorMessage ?? 'kit lookup failed';
            console.error(`[${tags.system}.${tagName}] failed to load kit ${id}. Error: ${errorMessage}`);
            return { success: false, type, id, errorMessage };
        }

        await reconstitutionPromise;

        shout("abMenuRefresh");

        const catalog = thisBot.abAskToolGetCatalog();
        return { success: true, type, id, catalog };
    } catch (e) {
        const errorMessage = ab.links.utils.getErrorMessage(e);
        console.error(`[${tags.system}.${tagName}] failed to load kit ${id}. Error: ${errorMessage}`);
        return { success: false, type, id, errorMessage };
    }
} else if (type === 'tool') {
    let isArtifact = false;

    // Find a kit in the scene containing this tool. Scope by studioId: when
    // given, restrict to kits from that studio; when omitted, restrict to kits
    // with no studioId (sourced from the global remember catalog).
    const toolbox = getBot(
        byTag("tool_array", tool_arr => Array.isArray(tool_arr) && tool_arr.find(tool => tool.targetAB == id)),
        argStudioId ? byTag("studioId", argStudioId) : bot => !bot.tags.studioId,
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
