tags.abIDOrigin = null;
const initialBots = getBots("system", "ab.home.initial");
for (let i = 0; i < initialBots.length; ++i) {
    if (initialBots[i] != thisBot) {
        destroy(initialBots[i]);
    }
}

if (ab.abIsPrimary()) {
   ab.links.manifestation.abSetAwake({ awake: true }) 
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}