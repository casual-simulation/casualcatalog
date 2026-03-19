for (let i = 0; i < that.bots.length; ++i) {
    if (that.bots[i].tags.tool_array) {
        const humeSocket = thisBot.vars.humeSocket;

        if(humeSocket) {
            humeSocket.send(JSON.stringify({
                "type": "session_settings",
                "variables": {
                    "name": abPersonality.tags.abBuilderIdentity,
                    "catalog_asks": await thisBot.getCatalogAsks()
                }
            }));
        }
    }

    if (that.bots[i].tags.abPatchBot == true && that.bots[i].tags.abPatchAskInput?.inquiry == tags.latestInquiry) {
        thisBot.sendToolCompleteMessage({id: tags.latestInquiryID});
    }
}
