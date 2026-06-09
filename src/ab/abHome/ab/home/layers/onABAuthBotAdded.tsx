if (tags.awaitingAuthBot) {
    masks.awaitingAuthBot = null;

    thisBot.onLayerStudioReturned({studioId: tags.awaitingStudio, inst: os.getCurrentInst()});
    masks.awaitingStudio = null;
}