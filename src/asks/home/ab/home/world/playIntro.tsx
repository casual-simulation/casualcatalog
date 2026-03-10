if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

masks.introPlayed = true;

const abPosition = await links.manifestation.getDefaultManifestPosition('map');
const newAB = await links.manifestation.abManifestBot({ dimension: 'home', position: abPosition });

// Play intro music sting.
const introMusicURL = links.learn.abBuildCasualCatalogURL('/asks/home-world-assets/music_launch.mp3');
os.playSound(introMusicURL);

await os.sleep(1000);

await os.focusOn(abPosition, { 
    zoom: links.manifestation.tags.defaultMapPortalZoom, 
    duration: 5, 
    portal: 'map',
    rotation: { x: 45, y: 45 },
    easing: {
        mode: 'inout',
        type: 'sinusoidal'
    }
});