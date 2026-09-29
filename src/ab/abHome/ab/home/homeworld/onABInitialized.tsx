// superShout("instCheckin", configBot.tags);
//Check login
if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] authBot not found`);
    }
    masks.awaitingAuthBot = true;
    await os.requestAuthBot();

    masks.awaitingAuthBot = null;
}

if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] User not logged in.`);
    }
    return;
}