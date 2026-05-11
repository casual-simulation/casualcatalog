//prevent automatic map focus
setTagMask(ab.links.remember, "mapPreventFocus", true);

if (ab.abIsPrimary()) {
   ab.links.manifestation.abSetAwake({ awake: true }) 
   links.homeworld.init();
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}