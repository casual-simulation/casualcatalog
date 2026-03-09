const currentInsts = Array.isArray(configBot.tags.inst) ? configBot.tags.inst : [configBot.tags.inst]; //Check if you have an inst sideloaded

if (currentInsts.length > 1){
    masks.loggedin = false; //SideLoading an inst soft-refreshes, which forcibly logs you out for a sec, so we need to let the bot know that you're logged out so it can log you back in


    //Setup miniGrid stuff
    miniGridPortalBot.tags.miniPortalHeight = 1; //.5;
    miniGridPortalBot.tags.miniPortalResizable = false;

    //Load what was opened when refreshed
    if (configBot.tags.mapPortal == "map"){
        configBot.tags.miniGridPortal = "sideLoad";
        superShout("openMiniGrid");

        let miniGridHudBot = getBot(byTag("name", "miniGridHudBot"));
        miniGridHudBot.openApp();
    }
    else if (configBot.tags.gridPortal == "home"){
        let gridHUD = getBot(byTag("name", "gridHudBot"));
        gridHUD.openApp();
    }
}

await os.requestAuthBotInBackground();
if (authBot?.id){
    if (masks.loggedin != true){
        let saveLoad = getBot(byTag("name", "saveload"));

        if (!(authBot.id in saveLoad.tags.recordKeys)) {
            //if (currentInsts.length == 1) thisBot.openApp();
            const recordKeyResult = await os.getPublicRecordKey(`rot-progress-${authBot.id}`);
            if (recordKeyResult.success){
                saveLoad.tags.recordKeys[authBot.id] = recordKeyResult.recordKey;
                saveLoad.tags.recordKeys = saveLoad.tags.recordKeys;
            }
        }

        if (authBot.id in saveLoad.tags.recordKeys){
            masks.loggedin = true;
            if (currentInsts.length == 1) thisBot.openApp();
            saveLoad.load();
        }
        else{
            os.toast("Login Failed: Please Create Record Key");
            if (currentInsts.length == 1) thisBot.openApp();
        }
    }
}
else{
    masks.loggedin = false;
    if (currentInsts.length == 1) thisBot.openApp();
    let collectionsMenu = getBot(byTag("name", "collectionsMenu"));
    let artifactData = getBot(byTag("name", "artifactData"));
    
    if (currentInsts.length == 1){
        collectionsMenu.masks.collectionsCompletion = [0];
        for (let i = 0; i < artifactData.tags.collectableIDs.length; i++){ //i is the index of the collection group [[1,2,3,4,5,6,7,8,9],[11],[12]]
            if (i == 0) collectionsMenu.masks.collectionsCompletion = [0];
            else collectionsMenu.masks.collectionsCompletion.push(0);
        }
        collectionsMenu.masks.collectionsCompletion = collectionsMenu.masks.collectionsCompletion;
    }
}