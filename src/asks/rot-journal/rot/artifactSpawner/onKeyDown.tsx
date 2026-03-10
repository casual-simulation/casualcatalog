// debug settings that spawn and delete artifacts 
switch (that.keys[0]) {
    case "D":
        let artifacts = getBots(byTag("#system", "rot.artifacts.artifact"))
        artifacts.push(...getBots("#system", "ab.pattern.abXPBot"))
        destroy(artifacts)
        break;
    case "S":
        thisBot.spawnArtifactGroup()
        break;
    case "W":
        thisBot.ensureNoDuplicates()
        break;
}