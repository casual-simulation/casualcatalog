if (tags.awaitingAuthBot) {
    masks.awaitingAuthBot = null;

    thisBot.onLayerStudioReturned({studioId: tags.awaitingStudio});
    masks.awaitingStudio = null;
}