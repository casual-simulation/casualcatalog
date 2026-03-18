if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    return;
}

const data = await os.getData(authBot.id, "RoTSave");

if (!data.success) {
    tags.userData = {
        discoveredLandmarks: [],
        collectedArtifacts: []
    }
    return;
}

tags.userData = data.data;