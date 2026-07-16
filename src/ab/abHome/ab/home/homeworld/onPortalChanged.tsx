if (!links.learn.abIsPrimary()) {
    return;
} 

if (that.portal == "mapPortal") {
    if (that.dimension) {
        // Override the mapZoomPosition with the homeBase position (if available).
        const homeBase = getBot(byTag("respawnPoint", true)); 

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] homeBase:`, homeBase);
        }

        if (homeBase && homeBase.tags[that.dimension + "X"] && homeBase.tags[that.dimension + "Y"]) {
            const homeBasePosition = { x: homeBase.tags[that.dimension + "X"] + 0.0005, y: homeBase.tags[that.dimension + "Y"] + 0.0005};

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] masking mapZoomPosition with homeBasePosition:`, homeBasePosition);
            }

            setTagMask(links.remember, "mapZoomPosition", homeBasePosition);
        } else {
            thisBot.handleCatalogSetup();
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
            // shout('resetHomeIntroMenu');

            // configBot.tags.menuPortal = 'homeIntroMenu';

            // links.menu.abCreateMenuButton({
            //     space: 'tempLocal',
            //     homeIntroMenu: true,
            //     label: 'go to home',
            //     homeworldBot: getLink(thisBot),
            //     resetHomeIntroMenu: `@
            //         destroy(thisBot);
            //     `,
            //     onClick: `@
            //         setTagMask(ab.links.remember, "mapPreventFocus", null);
                    
            //         links.homeworldBot.playIntro();
                    
            //         shout('resetHomeIntroMenu');
            //     `
            // })
            const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
            if (avatarBot) {
                avatarBot.onClick({origin: 'grid'});
            } else {
                //spawn avatar
                thisBot.spawnPlayer();
            }
        }
    } else {
        setTagMask(links.remember, "mapPreventFocus", null);
    }
}