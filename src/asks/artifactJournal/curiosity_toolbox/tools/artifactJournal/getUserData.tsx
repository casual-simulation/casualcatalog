if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    return;
}

const data = await os.getData("RoTSave", authBot.id);

if (!data.success) {
    tags.userData = {
        discoveredLandmarks: [],
        collectedArtifacts: []
    }
    return;
}

tags.userData = data.data;