//prevent automatic map focus
setTagMask(ab.links.remember, "mapPreventFocus", true);

if (ab.abIsPrimary()) {
   ab.links.manifestation.abSetAwake({ awake: true }) 
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}