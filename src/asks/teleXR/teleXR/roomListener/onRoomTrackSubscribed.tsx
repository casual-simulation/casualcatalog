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
        scale: 2,
        teleXRFocusOnClick: true,
        teleXRFocusZoom: 125,
        teleXRScaleOnClick: true,
        teleXRLaserPointable: true,
        teleXRScales: [1, 2, 3],
        onVideoBotCreated: `@
            const { newVideoBot, videoBots } = that;

            thisBot.positionRefresh({ videoBots });

            if (newVideoBot === thisBot) {
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

                thisBot.vars.tipTimeoutId = setTimeout(async () => {
                    if (tags.mouseOver && !tags.mouseClicked) {
                        thisBot.vars.tipTimeoutId = null;
                        thisBot.vars.tipId = await os.tip('Click to focus', undefined, undefined, 3);
                    }
                }, 750);
            } else if (modality === 'controller') {

            }
        `,
        onPointerExit: `@
            const { modality } = that;

            if (modality === 'mouse') {
                tags.mouseOver = false;
                tags.mouseClicked = false;

                if (thisBot.vars.tipTimeoutId) {
                    clearTimeout(thisBot.vars.tipTimeoutId);
                    thisBot.vars.tipTimeoutId = null;
                }

                if (thisBot.vars.tipId) {
                    os.hideTips(thisBot.vars.tipId);
                    thisBot.vars.tipId = null;
                }
            } else if (modality === 'controller') {

            }
        `,
        onClick: `@
            const { modality, buttonId } = that;

            if (modality === 'mouse' || modality === 'touch') {
                tags.mouseClicked = true;
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
        // positionRefresh: `@
        //     if (tags.userMoved) {
        //         return;
        //     }

        //     const { videoBots } = that;

        //     const index = videoBots.findIndex(b => b === thisBot);

        //     tags.homeX = 5;
        //     tags.homeY = -5 + (index * (tags.scaleX * tags.scale));
        // `,
        positionRefresh: `@
            // If the user dragged this bot, don't auto-move it.
            if (tags.userMoved) return;

            const { videoBots } = that;
            const index = videoBots.findIndex(b => b === thisBot);
            if (index < 0) return;

            const count = videoBots.length;
            if (count === 0) return;

            // Determine each bot's rendered size from scaleX/scaleY and scale.
            const sizes = videoBots.map(b => {
                const sx = typeof b.tags.scaleX === 'number' ? b.tags.scaleX : 1.6;
                const sy = typeof b.tags.scaleY === 'number' ? b.tags.scaleY : 1;
                const s  = typeof b.tags.scale  === 'number' ? b.tags.scale  : 3;
                return { w: sx * s, h: sy * s };
            });

            // Choose a near-square grid.
            const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
            const rows = Math.ceil(count / cols);

            // Cell size = max bot size + gap so nothing overlaps.
            let maxW = 0, maxH = 0;
            for (let i = 0; i < sizes.length; i++) {
                if (sizes[i].w > maxW) maxW = sizes[i].w;
                if (sizes[i].h > maxH) maxH = sizes[i].h;
            }
            const gapX = 0.5;
            const gapY = 0.5;
            const cellW = maxW + gapX;
            const cellH = maxH + gapY;

            // Keep your previous anchor style (top-left-ish).
            const leftX = 5;
            const topY  = -5;

            const col = index % cols;
            const row = Math.floor(index / cols);

            // Center this bot within its cell based on its own size.
            const myW = sizes[index].w;
            const myH = sizes[index].h;

            tags.homeX = leftX + col * cellW + (cellW - myW) / 2;
            tags.homeY = topY  + row * cellH + (cellH - myH) / 2;
        `
    });

    const videoBots = getBots('videoBot', true);
    sortBotsAZ(videoBots, 'sortOrder');

    shout('onVideoBotCreated', { newVideoBot, videoBots });
}