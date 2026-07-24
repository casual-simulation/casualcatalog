masks.currentKit = that.kit;
const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const posX = links.abBot?.tags[dimension + 'X'];
const posY = links.abBot?.tags[dimension + 'Y'];

destroy(links.abBot);

thisBot.abManifestBot({...that, dimension: dimension, position: {x: posX, y: posY}});