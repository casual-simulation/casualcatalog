console.log(`[${tags.system}.${tagName}] that:`, that);

if (that.kind === 'video') {
    const otherVideoBots = getBots('videoBot', true);

    // Calculate a sort order for the new video bot.
    let highestSortOrder = 0;
    for (let videoBot of otherVideoBots) {
        if (typeof videoBot.tags.sortOrder === 'number') {
            if (videoBot.tags.sortOrder > highestSortOrder) {
                highestSortOrder = videoBot.tags.sortOrder;
            }
        }
    }

    const newVideoBot = create({
        space: 'tempLocal',
        home: true,
        form: 'sprite',
        videoBot: true,
        sortOrder: highestSortOrder + 1,
        room: that.roomName,
        formAddress: that.address,
        videoAspectRatio: that.aspectRatio,
        videoSource: that.source,
        videoQuality: that.videoQuality,
        isRemote: that.isRemote,
        remoteId: that.remoteId,
        orientationMode: 'billboard',
        scaleX: that.aspectRatio > 0 ? that.aspectRatio : 1.6,
        scaleY: 1,
        scaleZ: 0.01,
        cursor: 'pointer',
        scale: 1,
        scales: [1, 2, 3],
        onVideoBotCreated: `@
            const { newVideoBot, videoBots } = that;

            if (newVideoBot === thisBot) {
                thisBot.positionRefresh({ videoBots });

                // Create outline bot for when speaking.
                const speakingOutlineBot = create({
                    space: 'tempLocal',
                    transformer: thisBot.id,
                    form: 'sprite',
                    color: '#68BC00',
                    home: false,
                    homeX: 0,
                    homeY: 0,
                    homeZ: -1,
                    scaleZ: 0.01,
                    scaleX: 1.1,
                    scaleY: 1.15
                })

                links.speakingOutlineBot = getLink(speakingOutlineBot);
            }
        `,
        onVideoBotDestroyed: `@
            const { videoBots } = that;
            thisBot.positionRefresh({ videoBots });
        `,
        onDestroy: `@
            destroy(links.speakingOutlineBot);
        `,
        onDrag: `@
            tags.userMoved = true;
        `,
        onPointerEnter: `@
            const { modality } = that;

            if (modality === 'mouse') {
                tags.mouseOver = true;

                thisBot.vars.scaleTipTimeoutId = setTimeout(async () => {
                    if (tags.mouseOver && !tags.mouseClicked) {
                        thisBot.vars.scaleTipTimeoutId = null;
                        thisBot.vars.scaleTipId = await os.tip('Click to change size', undefined, undefined, 3);
                    }
                }, 750);
            }
        `,
        onPointerExit: `@
            const { modality } = that;

            if (modality === 'mouse') {
                tags.mouseOver = false;
                tags.mouseClicked = false;

                if (thisBot.vars.scaleTipTimeoutId) {
                    clearTimeout(thisBot.vars.scaleTipTimeoutId);
                    thisBot.vars.scaleTipTimeoutId = null;
                }

                if (thisBot.vars.scaleTipId) {
                    os.hideTips(thisBot.vars.scaleTipId);
                    thisBot.vars.scaleTipId = null;
                }

            }
        `,
        onClick: `@
            const { modality, buttonId } = that;

            let changeScale = false;
            if (modality === 'mouse') {
                tags.mouseClicked = true;
                changeScale = buttonId === 'left';
            } else {
                changeScale = true;
            }

            if (changeScale) {
                const currentScaleIndex = tags.scales.findIndex(s => s === tags.scale);

                let nextScaleIndex = currentScaleIndex + 1;

                if (nextScaleIndex >= tags.scales.length) {
                    nextScaleIndex = 0;
                }

                tags.scale = tags.scales[nextScaleIndex];
            }
        `,
        onRoomSpeakersChanged: `@
            const { speakerIds } = that;
            const speaking = speakerIds.some(id => id === tags.remoteId);

            if (speaking) {
                if (links.speakingOutlineBot) {
                    links.speakingOutlineBot.tags.home = true;
                }
            } else {
                if (links.speakingOutlineBot) {
                    links.speakingOutlineBot.tags.home = false;
                }
            }
        `,
        positionRefresh: `@
            if (tags.userMoved) {
                return;
            }

            const { videoBots } = that;

            const index = videoBots.findIndex(b => b === thisBot);

            tags.homeX = 5;
            tags.homeY = -5 + (index * tags.scaleX);
        `,
        system: `livekit-room-test.videoBot-${that.remoteId}`
    });

    const videoBots = getBots('videoBot', true);
    sortBotsAZ(videoBots, 'sortOrder');

    shout('onVideoBotCreated', { newVideoBot, videoBots });
}