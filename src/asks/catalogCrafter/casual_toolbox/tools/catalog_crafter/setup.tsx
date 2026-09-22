const data = that.data ?? {};

tags.label = data.label ?? '';
tags.scaleX = data.scaleX ?? 2;
tags.scaleY = data.scaleY ?? 2;
tags.scaleZ = data.scaleZ ?? 1;
tags.color = data.color ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD';
tags.labelFloatingBackgroundColor = data.labelFloatingBackgroundColor ?? abPersonality?.tags?.abBaseColor ?? '#00D9CD'; 
tags.labelColor = data.labelColor ?? abPersonality?.tags?.abBaseLabelColor ?? 'black';
tags.studioId = data.studioId;
tags.strokeColor = abPersonality?.tags.abBaseStrokeColor;
tags.toolbox_array = data.toolbox_array ?? ab.links.remember.tags.toolbox_array;
tags.armColor = "white";
tags.armMeshPath = ab.links.remember.tags.abArmMeshPath;
tags.abIgnore = true;

if (data.dimensionData) {
    for (const tagName in data.dimensionData) {
        tags[tagName] = data.dimensionData[tagName];
    }
}

if (data.eggParameters) {
    ab.links.utils.applyGridInfoFromEggParams({ bot: thisBot, eggParameters: data.eggParameters });
}

let hasCustomMesh = false;
if (tags.studioId) {
    hasCustomMesh = await thisBot.applyStudioConfig();
    tags.hasCustomMesh = hasCustomMesh;
}

if (!hasCustomMesh) {
    // tags.formAddress = ab.abBuildCasualCatalogURL('/asks/meshes/hexagon_unlit.glb');
    tags.scaleX = 1;
    tags.scaleY = 1.7;
    tags.scaleZ = 1;
    tags.form = null;

    tags.defaultVisualBot = getLink(await thisBot.generateDefaultVisualBot());
    tags.color = 'clear';
    tags.strokeColor = null;
}

tags.abCatalogSelected = false;
await os.sleep();
thisBot.onClick();