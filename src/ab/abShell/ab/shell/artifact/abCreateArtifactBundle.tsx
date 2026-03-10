const {
    abArtifactName,
    abArtifactShard,
} = that;

assert(abArtifactName, `[${tags.system}.${tagName}] abArtifactName is a required parameter.`);
assert(abArtifactShard && abArtifactShard.data && abArtifactShard.dependencies, `[${tags.system}.${tagName}] abArtifactShard is a required to be a ABArtifactShard.`);

const abArtifactBundle: ABArtifactBundle = {
    name: abArtifactName,
    formatVersion: 1,
    data: abArtifactShard.data,
    dependencies: abArtifactShard.dependencies,
}

// Generate the artifact id, which is sha256 hash of the core contents of the artifact.
abArtifactBundle.id = crypto.sha256(abArtifactBundle);

// Store some extra metadata properties with the artifact.
// These are not core to the artifact's functionality but may be useful as artifacts evolve.
abArtifactBundle.casualOSVersion = os.version();
abArtifactBundle.createdTimestamp = DateTime.now().toISO();
abArtifactBundle.abShellVersion = `${links.version.raw.abShellMajorVersion}.${links.version.raw.abShellMinorVersion}`;

return abArtifactBundle;