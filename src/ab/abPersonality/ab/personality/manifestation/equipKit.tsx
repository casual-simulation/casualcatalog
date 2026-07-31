const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const posX = links.abBot?.tags[dimension + 'X'];
const posY = links.abBot?.tags[dimension + 'Y'];
let newPosX = posX;
let newPosY = posY;

const inMap = configBot.tags.mapPortal ? true : false;

if (tags.currentKit && tags.currentKit != 'log' && tags.currentKit != 'catalog') {
    let phys_kit = links.kitBot;
    if (!phys_kit) {
        phys_kit = getBot('kitId', tags.currentKit);
    }

    let radius = inMap ? .0002 : 3;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.sqrt(Math.random()) * radius;
    const phys_kit_posX = posX + distance * Math.cos(angle);
    const phys_kit_posY = posY + distance * Math.sin(angle);

    if (phys_kit) {
        phys_kit.manifest({dimension: dimension, position: {x: phys_kit_posX, y: phys_kit_posY}})
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
    } else {
        await links.catalog.loadKit({id: that.kit + '_loader', hideOnLoad: true})
    }
}

if (links.kitBot) {
    links.kitBot.tags[dimension] = false;
    newPosX = links.kitBot.tags[dimension + 'X'];
    newPosY = links.kitBot.tags[dimension + 'Y'];
}

destroy(links.abBot);

thisBot.abManifestBot({...that, dimension: dimension, position: {x: newPosX, y: newPosY}});