if (links.pairedTile) {
    let xPos = links.pairedTile.tags.homeX;
    let yPos = links.pairedTile.tags.homeY;

    shout("doSharedAction", { actionType: "playSound", actionData: "teleport" });

    await os.sleep(200);

    setTagMask(that, "homeX", xPos, "shared");
    setTagMask(that, "homeY", yPos, "shared");


}