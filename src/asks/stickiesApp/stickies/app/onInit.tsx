// Get a list of who is in the inst
const remotes = await os.remotes();
tags.playerList = remotes;

await os.sleep(500);

if(!configBot){
    return;
}

// Move this player to the front if they are in the grid portal
// (push other portals to the back to keep interactions in the grid)
if (configBot.tags.gridPortal &&
    !configBot.tags.sheetPortal &&
    !configBot.tags.systemPortal
    ) {
    const myID = configBot.id
    remotes.sort((a,b) => { return a === myID ? -1 : b === myID ? 1 : 0 });
    tags.playerList = remotes;
}

shout("stickiesAppLoaded");