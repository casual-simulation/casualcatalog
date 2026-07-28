const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const posX = links.abBot?.tags[dimension + 'X'];
const posY = links.abBot?.tags[dimension + 'Y'];

const inMap = configBot.tags.mapPortal ? true : false;

if (tags.currentKit && tags.currentKit != 'log' && tags.currentKit != 'catalog') {
    let phys_kit = links.kitBot;
    if (!phys_kit) {
        phys_kit = getBot('kitId', tags.currentKit);
    }

    if (phys_kit) {
        phys_kit.manifest({dimension: dimension, position: {x: posX, y: posY + (inMap ? .0002 : 2)}})
    }
}

masks.currentKit = that.kit;
if (!that.kitBot) {
    masks.kitBot = null;
    tags.kitBot = null;
} else {
   masks.kitBot = that.kitBot; 
}

if (!links.kitBot) {
    const phys_kit = getBot('kitId', that.kit);
    if (phys_kit) {
        masks.kitBot = getLink(phys_kit);
    }
}

if (links.kitBot) {
    links.kitBot.tags[dimension] = false;
}

destroy(links.abBot);

thisBot.abManifestBot({...that, dimension: dimension, position: {x: posX, y: posY}});