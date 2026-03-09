const abArtifactNames = new Set();

getBots((b) => {
    if (b.tags.abArtifactName) {
        abArtifactNames.add(b.tags.abArtifactName);
    }
})

return abArtifactNames;