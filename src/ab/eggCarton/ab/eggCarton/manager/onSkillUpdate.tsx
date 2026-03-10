try {
    await analytics.recordEvent("practice_permit_scanned", {staticInst: configBot.tags.staticInst});
} catch (e) {
    console.log(e);
}

//const recordedPermit = await thisBot.aiPermit_request();
if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (authBot) {
    // const recordCheck = await os.getData(authBot.id, "ai_permit");
    // if (!recordCheck.success) {
    //     os.toast("no ai_permit found");
    //     return;
    // }

    if (configBot.tags.requestingAI) {
        const confirm = await os.showConfirm({
            title: "Email digital@grpm.org to request ai access.",
            content: "The message body will be copied to your clipboard."
        });

        if (confirm) {
            await os.setClipboard(`user: ${authBot.id}, is requesting ai access from permit: ${configBot.tags.staticInst}.`);
        }
    }
    
    const currentURL = new URL(configBot.tags.url);
    const origin = currentURL.origin;

    let newURL = new URL(origin);

    if (configBot.tags.comId) {
        newURL.searchParams.append("comId", configBot.tags.comId);
    }

    newURL.searchParams.append("owner", 'player');
    newURL.searchParams.append("inst", 'home');
    newURL.searchParams.append("mapPortal", 'home');
    newURL.searchParams.append("ask", 'home');
    newURL.searchParams.append("abStayAwake", 'true');

    os.goToURL(newURL.href)
}