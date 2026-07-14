if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (!links.learn.abIsPrimary()) {
    return;
} 

masks.introPlayed = true;

const studio = configBot.tags.studio ?? authBot.id;
let respawnData;

if (!tags.homeRespawnX) {
    respawnData = await os.getData(studio, "homeworldRespawnPoint");
    if (respawnData.success) {
        masks.homeRespawnX = respawnData.data.x;
        masks.homeRespawnY = respawnData.data.y;
        respawnData.data.x = respawnData.data.x + .0003;
    }
} else {
    respawnData = {
        data: {
            x: tags.homeRespawnX + .0003,
            y: tags.homeRespawnY
        }
    }
}

const abPosition = respawnData?.data ?? await ab.links.manifestation.getDefaultManifestPosition('map');
const newAB = await ab.links.manifestation.abManifestBot({ dimension: 'home', position: abPosition });

// Play intro music sting.
const introMusicURL = ab.abBuildCasualCatalogURL('/asks/home-world-assets/music_launch.mp3');
os.playSound(introMusicURL);

await os.sleep(1000);

await os.focusOn(abPosition, { 
    zoom: ab.links.manifestation.tags.defaultMapPortalZoom, 
    duration: 5, 
    portal: 'map',
    rotation: { x: 45, y: 45 },
    easing: {
        mode: 'inout',
        type: 'sinusoidal'
    }
});