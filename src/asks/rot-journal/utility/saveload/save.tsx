/*if (!(authBot.id in tags.recordKeys)) {
    const recordKeyResult = await os.getPublicRecordKey(`rot-progress-${authBot.id}`);
    tags.recordKeys[authBot.id] = recordKeyResult.recordKey;
}*/

let hudBot = getBot(byTag("name", "hudBot"));

//await os.recordData(recordKeyResult.recordKey, "collection1", "test data");
if ((authBot.id in tags.recordKeys) && (hudBot.masks.currentlySaving == false || hudBot.masks.currentlySaving == null)){
    hudBot.masks.currentlySaving = true;

    let finishedSaving = false;
    /*while (finishedSaving == false) {
        await os.recordData(tags.recordKeys[authBot.id], that, (getBot(byTag("name", that)).masks.items));

        const result = await os.getData(tags.recordKeys[authBot.id], that);
        if (result.success){
            let collectionBot = getBot(byTag("name", that));
            if (collectionBot.masks.items.toString() != result.data.toString()){ //If saved data doesn't match the current setup
                //Need to try saving again
            }
            else{ //Save finished
                finishedSaving = true;
                hudBot.masks.currentlySaving = false;
            }
        }
        else{
            finishedSaving = true;
            hudBot.masks.currentlySaving = false;
            os.toast("Error getting data. Save canceled");
        }
    }*/
    while (finishedSaving == false) {
        await os.recordData(tags.recordKeys[authBot.id], "itemCollectionStates", masks.itemSaves);

        const result = await os.getData(tags.recordKeys[authBot.id], "itemCollectionStates");
        if (result.success){
            //if (masks.itemSaves.toString() != result.data.toString()){ //If saved data doesn't match the current setup
                //Need to try saving again
            //}
            //else{ //Save finished
                finishedSaving = true;
                hudBot.masks.currentlySaving = false;
            //}
        }
        else{
            finishedSaving = true;
            hudBot.masks.currentlySaving = false;
            os.toast("Error getting data. Save canceled");
        }
    }
}