const { 
    abArtifactName,
    abArtifactInstanceID,
} = that ?? {};

const artifactBundles: Record<string, ABArtifactBundle> = {}; // Key is artifact id

getBots((b) => {
    if (b.tags.abArtifactName && b.tags.abArtifactBundle) {
        // Optional: filter by abArtifactName.
        if (abArtifactName && abArtifactName !== b.tags.abArtifactName) {
            return;
        }

        // Optional: filter by abArtifactInstanceID
        if (abArtifactInstanceID && abArtifactInstanceID !== b.tags.abArtifactInstanceID) {
            return;
        }

        const artifactId = b.tags.abArtifactBundle.id;

        if (artifactId && !artifactBundles[artifactId]) {
            artifactBundles[artifactId] = b.tags.abArtifactBundle;
        }
    }
});

return artifactBundles;