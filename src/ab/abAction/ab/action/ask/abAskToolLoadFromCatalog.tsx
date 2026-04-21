const type: 'kit' | 'tool' = that.args.type;
const id: string = that.args.id;
const gridDimension: string = that.args.gridDimension ?? ab.links.remember.tags.abActiveDimension ?? 'home';;
const gridPositionX: number = that.args.gridPositionX ?? 0;
const gridPositionY: number = that.args.gridPositionY ?? 0;

const gridData = {
    dimension: gridDimension,
    position: {
        x: gridPositionX,
        y: gridPositionY
    }
}

if (type === 'kit') {
    const toolboxData = ab.links.remember.tags.toolbox_array.find(toolBox => toolBox.name == id);
    await links.toolbox.toolbox_add({ toolboxData, gridData });
    const catalog = thisBot.abAskToolGetCatalog();

    return { success: true, type, id, catalog }
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

            return { success: true, type, id, bots: shardBots }
        } catch (e) {
            const errorMessage =  ab.links.utils.getErrorMessage(e);
            console.error(`[${tags.system}.${tagName}] failed to load tool ${id} as artifact. Error: ${errorMessage}`);

            return { success: false, type, id, errorMessage }
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
                return { success: true, type, id, bots: lookupResult.hatchedBots }
            } else {
                const errorMessage = 'failed';
                return { success: false, type, id, errorMessage }
            }
        } catch (e) { 
            const errorMessage = ab.links.utils.getErrorMessage(e);
            console.error(`[${tags.system}.${tagName}] failed to load tool ${id}. Error: ${errorMessage}`);

            return { success: false, type, id, errorMessage }
        }
    }
} else {
    const errorMessage = `type '${type}' is not implemented`;
    console.error(`[${tags.system}.${tagName}] ${errorMessage}`);

    return { success: false, type, id, errorMessage }
}