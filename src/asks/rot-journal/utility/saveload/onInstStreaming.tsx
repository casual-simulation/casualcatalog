await os.requestAuthBotInBackground();
if (!(authBot?.id) && (configBot.id in tags.tempSaves)) { //If not logged in but user's ID is in the tempSaves
    masks.itemSaves = tags.tempSaves[configBot.id];
    masks.itemSaves = masks.itemSaves;

    delete tags.tempSaves[configBot.id];
    tags.tempSaves = tags.tempSaves;
}
else if (!(authBot?.id) || that == "loadEmpty"){
    let artifactData = getBot(byTag("name", "artifactData"));
    masks.itemSaves = [];
    for (let i = 0; i < artifactData.tags.artifactInfo[artifactData.tags.artifactInfo.length - 1].id; i++){
        masks.itemSaves[i] = 0;
    }

    //masks.itemSaves = [0,0,0,0,0,0,0,0,0];
}