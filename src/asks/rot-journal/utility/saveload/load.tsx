/*if (!(authBot.id in tags.recordKeys)) {
    const recordKeyResult = await os.getPublicRecordKey(`rot-progress-${authBot.id}`);
    tags.recordKeys[authBot.id] = recordKeyResult.recordKey;
}*/

//if (authBot.id in tags.recordKeys) await os.recordData(tags.recordKeys[authBot.id], "collection1", "test data");
/*if (authBot.id in tags.recordKeys){
    const result1 = await os.getData(tags.recordKeys[authBot.id], "collection1");
    if (result1.success) {
        let collection1Bot = getBot(byTag("name", "collection1"));

        if (collection1Bot.masks.items == null || (!collection1Bot.masks.items.includes(2) && !collection1Bot.masks.items.includes(1) && (result1.data.includes(2) || result1.data.includes(1)))){
            collection1Bot.masks.items = result1.data;
            collection1Bot.masks.items = collection1Bot.masks.items;
        }
        else if (collection1Bot.masks.items.toString() != result1.data.toString() && (collection1Bot.masks.items.includes(2) || collection1Bot.masks.items.includes(1))){ //If the lists aren't the same and the collection isn't completely empty
            //Check if there's any to overwrite
            let overwrite = false;

            for (let i = 0; i < collection1Bot.masks.items.length; i++){
                if ((collection1Bot.masks.items[i] == 2 || collection1Bot.masks.items[i] == 1) && result1.data[i] == 0) overwrite = true;
                else if (collection1Bot.masks.items[i] == 2 && result1.data[i] == 1) overwrite = true;

                if (collection1Bot.masks.items[i] == 2 || result1.data[i] == 2) collection1Bot.masks.items[i] = 2;
                else if (collection1Bot.masks.items[i] == 1 || result1.data[i] == 1) collection1Bot.masks.items[i] = 1;
                else collection1Bot.masks.items[i] = 0;
            }
            collection1Bot.masks.items = collection1Bot.masks.items;

            if (overwrite == true){ //If one was changed, save the new list
                thisBot.save("collection1");
            }
        }
        else{ //If they're the same, you don't have to do anything
            //os.log("Same thing, so no need to do anything");
        }

        os.toast("Successfully Loaded");
    }
    else {
        os.log("Failed " + result1.errorMessage);
    }
}*/
if (authBot.id in tags.recordKeys){
    const result = await os.getData(tags.recordKeys[authBot.id], "itemCollectionStates");
    if (result.success) {
        if (masks.itemSaves == null || (!masks.itemSaves.includes(2) && !masks.itemSaves.includes(1) && (result.data.includes(2) || result.data.includes(1)))){
            masks.itemSaves = result.data;
            masks.itemSaves = masks.itemSaves;
        }
        else if (masks.itemSaves.toString() != result.data.toString() && (masks.itemSaves.includes(2) || masks.itemSaves.includes(1))){ //If the lists aren't the same and the collection isn't completely empty
            //Check if there's any to overwrite
            let overwrite = false;

            for (let i = 0; i < masks.itemSaves.length; i++){
                if ((masks.itemSaves[i] == 2 || masks.itemSaves[i] == 1) && result.data[i] == 0) overwrite = true;
                else if (masks.itemSaves[i] == 2 && result.data[i] == 1) overwrite = true;

                if (masks.itemSaves[i] == 2 || result.data[i] == 2) masks.itemSaves[i] = 2;
                else if (masks.itemSaves[i] == 1 || result.data[i] == 1) masks.itemSaves[i] = 1;
                else masks.itemSaves[i] = 0;
            }
            masks.itemSaves = masks.itemSaves;

            if (overwrite == true){ //If one was changed, save the new list
                thisBot.save("collection1");
            }
        }
        else{ //If they're the same, you don't have to do anything
            //os.log("Same thing, so no need to do anything");
        }
        console.log("results are: "+ result.data);
        let artifactBots= getBots(byTag("abIDOrigin","rot-templateArtifact"));
        for (let index = 0; index < artifactBots.length; index++)
        {
            const i = artifactBots[index]
            //console.log(result.data[i.tags.Artifact.data.id-1]);
            if (result.data[i.tags.Artifact.data.id-1]==1)
            {
                i.tags.discovered=true;
                i.tags.color="#04b1ff"
            }
            if (result.data[i.tags.Artifact.data.id-1]==2)
            {
                i.tags.form="";
                i.tags.scale=0.6
                i.tags.discoveredArtifact = true
                i.tags.discovered=true;
                i.tags.color="#04b1ff"
            }
            //console.log(i.tags.Artifact.data.id-1)
        }
        shout("checkForNewDiscovery")
        os.toast("Successfully Loaded");
    }
    else {
        os.log("Failed " + result.errorMessage);
        thisBot.onInstStreaming("loadEmpty");
    }
}