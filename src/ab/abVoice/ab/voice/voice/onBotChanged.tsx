if (that.tags.includes("handRaised")) {
    //create bot above ab with special clickable label
    
    const abBot = ab.links.manifestation.links.abBot;
    if (!abBot) {
        return;
    }

    if (tags.handRaised) {
        const notifBots = getBots("abVoiceNotificationBot", true);
        destroy(notifBots);
        
        create({
            transformer: getID(abBot),
            onClick: `@
                links.voice.calledOn(thisBot);
            `,
            name: "abVoiceNotifBot",
            voice: getLink(thisBot),
            abVoiceNotificationBot: true,
            [ab.links.remember.tags.abActiveDimension]: true,
            [ab.links.remember.tags.abActiveDimension + 'Z']: 1,
            form: 'sprite',
            focusable: true,
            onFocusEnter: `@
                if (that.bot == thisBot) {
                    thisBot.onClick();
                }
            `,
            orientationMode: 'billboard',
            space: "tempLocal",
            formAddress: 'https://auth-aux-prod-filesbucket-682397690660.s3.amazonaws.com/64beb439-12b9-4155-b388-db03b7ec1c9c/89299d8c58f97f8853a9e87d4a0207574839dbeb3c66b92ea691db710b33c516',

        })
    } else {
        const notifBots = getBots("abVoiceNotificationBot", true);
        destroy(notifBots);
    }
}