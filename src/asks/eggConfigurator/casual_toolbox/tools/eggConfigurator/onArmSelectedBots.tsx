const catalog = getBot(byTag("studioCatalog", true), byTag("studioId", tags.studioId));

if (!catalog) {
    return;
}

catalog.masks.selectedBots = getLink(that);
catalog.handleSelectMenu({baseAB: tags.chosenEggName});