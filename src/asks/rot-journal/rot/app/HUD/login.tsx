if (authBot?.id){
    //os.toast("Clicked while logged in");

    if (masks.loggedin != true){
        let saveLoad = getBot(byTag("name", "saveload"));

        if (!(authBot.id in saveLoad.tags.recordKeys)) {
            const recordKeyResult = await os.getPublicRecordKey(`rot-progress-${authBot.id}`);
            if (recordKeyResult.success){
                saveLoad.tags.recordKeys[authBot.id] = recordKeyResult.recordKey;
                saveLoad.tags.recordKeys = saveLoad.tags.recordKeys;
            }
        }

        if (authBot.id in saveLoad.tags.recordKeys){
            masks.loggedin = true;
            saveLoad.load();
        }
        else{
            os.toast("Login Failed: Please Create Record Key");
        }
    }
}
else{ //Not logged in
    shout("changeReadKeys", false);
    await os.requestAuthBot();
    if (authBot != null){ //Now logged in
        let saveLoad = getBot(byTag("name", "saveload"));

        if (!(authBot.id in saveLoad.tags.recordKeys)) {
            const recordKeyResult = await os.getPublicRecordKey(`rot-progress-${authBot.id}`);
            if (recordKeyResult.success){
                saveLoad.tags.recordKeys[authBot.id] = recordKeyResult.recordKey;
                saveLoad.tags.recordKeys = saveLoad.tags.recordKeys;
            }
        }

        if (authBot.id in saveLoad.tags.recordKeys){
            masks.loggedin = true;
            saveLoad.load();
        }
        else{
            os.toast("Login Failed: Please Create Record Key");
        }
    }
    shout("changeReadKeys", true);
}