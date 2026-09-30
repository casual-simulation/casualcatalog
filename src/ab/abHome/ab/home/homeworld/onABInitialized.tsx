// superShout("instCheckin", configBot.tags);
if (ab.abIsPrimary()) {
    setTagMask(links.remember, "mapPreventFocus", true);
}

configBot.tags.abStayAwake = null;
os.syncConfigBotTagsToURL(["abStayAwake"]);

//Check login
if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] authBot not found`);
    }
    await os.requestAuthBot();
}