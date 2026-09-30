// superShout("instCheckin", configBot.tags);
configBot.tags.abStayAwake = null;
os.syncConfigBotTagsToURL(["abStayAwake"]);
await os.sleep(0);

if (ab.abIsPrimary()) {
    setTagMask(links.remember, "mapPreventFocus", true);
    await links.manifestation.abSetAwake({ awake: true })
} else {
    await links.manifestation.abSetAwake({ awake: false })
}

//Check login
if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] authBot not found`);
    }
    await os.requestAuthBot();
}

thisBot.initPreCheck();