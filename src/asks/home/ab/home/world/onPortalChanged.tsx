if (that.portal == "mapPortal") {
    if (that.dimension) {
        // Override the mapZoomPosition with the homeBase position (if available).
        const homeBase = getBot(byTag("studioStation", true), byTag("studioId", authBot?.id)); 

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] homeBase:`, homeBase);
        }

        if (homeBase && homeBase.tags[that.dimension + "X"] && homeBase.tags[that.dimension + "Y"]) {
            const homeBasePosition = { x: homeBase.tags[that.dimension + "X"] + 0.0005, y: homeBase.tags[that.dimension + "Y"] + 0.0005};

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] masking mapZoomPosition with homeBasePosition:`, homeBasePosition);
            }

            setTagMask(links.remember, "mapZoomPosition", homeBasePosition);
        }

        if (!masks.introPlayed) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] setting mapPreventFocus to true`);
            }

            // Lock automatic zooming on the map portal done by manifestation bot.
            setTagMask(links.remember, "mapPreventFocus", true);

            // Set initial start zoom for homeworld.
            const abPosition = await links.manifestation.getDefaultManifestPosition('map');
            await os.focusOn(abPosition, { duration: 0, portal: 'map', zoom: 999999999 });

            // Show home intro menu.
            shout('resetHomeIntroMenu');

            configBot.tags.menuPortal = 'homeIntroMenu';

            links.menu.abCreateMenuButton({
                space: 'tempLocal',
                homeIntroMenu: true,
                label: 'go to home studio',
                homeworldBot: getLink(thisBot),
                resetHomeIntroMenu: `@
                    destroy(thisBot);
                `,
                onClick: `@
                    configBot.tag                    
                    setTagMask(links.homeworldBot.links.remember, "mapPreventFocus", null);
                    
                    links.homeworldBot.playIntro();
                    
                    shout('resetHomeIntroMenu');
                `
            })
        }
    } else {
        setTagMask(links.remember, "mapPreventFocus", null);
    }
}