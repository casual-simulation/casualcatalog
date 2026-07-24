const id = that?.id;
const argGridInformation = that?.gridInformation;

if (!id) {
    return { success: false, errorMessage: 'missing required arg: id' };
}

const toolboxes = tags.toolbox_array ?? [];
const toolbox = toolboxes.find(tb => tb && (tb.name === id || tb.title === id));

if (!toolbox) {
    return { success: false, errorMessage: `kit '${id}' not found in catalog '${tags.label}'` };
}

const expectedLabel = toolbox.title ?? toolbox.name;

const existing = getBot((b) => {
    return b.tags.abArtifactName === 'kit' &&
           b.tags.studioId === tags.studioId &&
           b.tags.label === expectedLabel &&
           b.tags.lineTo === thisBot.id;
});

if (existing) {
    return { success: true, alreadyLoaded: true };
}

let gridInformation = argGridInformation;
if (!gridInformation) {
    const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    const isMap = configBot.tags.mapPortal ? true : false;
    const inRad = isMap ? .0001 : 3;
    const rad = isMap ? .0005 : 5;
    const space = isMap ? .0005 : 1;

    const pos = ab.links.utils.findOpenPositionAround({
        center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']),
        dimension: dimension,
        innerRadius: inRad,
        radius: rad,
        spacing: space,
    });

    gridInformation = {
        dimension: dimension,
        position: { x: pos.x, y: pos.y },
    };
}

// onLookupAskID hatches the kit *loader*, which then asynchronously hatches
// the actual kit artifact. Listen for that second-stage reconstitute before
// resolving so callers can read tool_array immediately on resolution. Set up
// the listener before triggering the load to avoid missing the event.
const reconstitutionPromise = ab.links.artifact.awaitArtifactReconstitution({
    matchSuccess: (e) => {
        return e?.abArtifactName === 'kit' && e?.shardBots?.some((b) => {
            return b?.tags?.label === expectedLabel &&
                b?.tags?.studioId === tags.studioId;
        });
    },
    matchFailure: (e) => e?.abArtifactName === 'kit',
    timeoutMs: 15000,
}).catch(e => {
    if (e?.timedOut) {
        console.warn(`[${tags.system}.${tagName}] kit ${toolbox.name} reconstitute did not arrive within timeout.`);
        return { timedOut: true };
    }
    throw e;
});

try {
    await ab.links.search.onLookupAskID({
        askID: toolbox.name,
        space: "local",
        eggParameters: {
            studioId: tags.studioId,
            toolbox_name: expectedLabel,
            gridInformation: gridInformation,
        },
    });

    const reconstituteResult = await reconstitutionPromise;

    return { success: true, timedOut: reconstituteResult?.timedOut ?? false };
} catch (e) {
    return { success: false, errorMessage: ab.links.utils.getErrorMessage(e) };
}
