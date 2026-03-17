const userData = {...tags.userData};
if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    console.log("[artifactJournal]: user not logged in.")
    return;
}

await os.recordData("RoTSave", authBot.id, userData);