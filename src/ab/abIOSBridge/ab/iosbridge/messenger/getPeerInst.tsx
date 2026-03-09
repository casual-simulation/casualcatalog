// Create peer join bot
if (tags.debug) os.log("Creating a peer bot");

let joinBotPosition = {x: 0, y: 0}

if (configBot.tags.mapPortal) {
    const geolocation = await os.getGeolocation();
    if (geolocation.success) {
        joinBotPosition = { x: geolocation.longitude, y: geolocation.latitude }
    }
} else {
    const focusPoint = os.getFocusPoint("grid");
    joinBotPosition = { x: focusPoint.x, y: focusPoint.y }
}

const peerBot = create({
    space: 'tempLocal',
    home: true,
    homeX: joinBotPosition.x,
    homeY: joinBotPosition.y,
    color: 'clear',
    label: 'guest',
    labelColor: 'white',
    strokeColor: 'white',
    strokeWidth: 2,
    labelFloatingBackgroundColor: 'clear',
    labelPosition: 'floatingBillboard',
    labelWordWrapMode: 'none',
    peerInst: that,
    debug: tags.debug,
    onClick: `@
        let join = await os.showConfirm({
            title: 'Join Peer',
            content: 'Would you like to join peer inst?',
            confirmText: 'Join',
            cancelText: 'Ignore'
        })

        if (join) {
            if (tags.debug) os.log("We hit that join button!");
            let messengerBot = getBot("system", "ab.iosbridge.messenger");
            whisper(messengerBot, "joinPeerInst", thisBot.tags.peerInst);
            destroy(thisBot);
        } else {
            if (tags.debug) os.log("We hit that ignore button...");
            destroy(thisBot);
        }
    `,
    onPortalChanged: `@
        let joinBotPosition = {x: 0, y: 0}
        if (configBot.tags.mapPortal) {
            const geolocation = await os.getGeolocation();
            if (geolocation.success) {
                joinBotPosition = { x: geolocation.longitude, y: geolocation.latitude }
            }
        } else {
            const focusPoint = os.getFocusPoint("grid");
            joinBotPosition = { x: focusPoint.x, y: focusPoint.y }
        } 
        thisBot.tags.homeX = joinBotPosition.x;
        thisBot.tags.homeY = joinBotPosition.y;
    `
});

// Add these to peerBot onClick:

// Create a menu with two options:

// Join:
// let messengerBot = getBot("system", "ab.iosbridge.messenger");
// whisper(messengerBot, "joinPeerInst", thisBot.tags.peerInst);
// destroy(thisBot);

// Ignore:
// destroy(thisBot);