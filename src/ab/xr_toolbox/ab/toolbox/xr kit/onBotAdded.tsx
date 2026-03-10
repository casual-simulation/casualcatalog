let waitTime = 0;

while (!globalThis.ab) {
    if (waitTime >= 5000) {
        return;
    }

    await os.sleep(250);
    waitTime += 250;
}

masks.abGridMenuIcon = ab.abBuildCasualCatalogURL('/ab/icons/vr_goggles.svg');