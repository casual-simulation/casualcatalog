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

try {
    await ab.links.search.onLookupAskID({
        askID: toolbox.name,
        eggParameters: {
            studioId: tags.studioId,
            toolbox_name: expectedLabel,
            gridInformation: gridInformation,
        },
    });

    return { success: true };
} catch (e) {
    return { success: false, errorMessage: ab.links.utils.getErrorMessage(e) };
}
