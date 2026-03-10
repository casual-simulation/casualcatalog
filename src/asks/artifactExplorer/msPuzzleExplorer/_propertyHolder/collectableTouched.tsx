console.log("collectable touched that: ", that)

if (tags.home == true) {
    if (that.tags.playerTile == true) {
        shout("doSharedAction", { actionType: "playSound", actionData: "collectablePickup" });
        // shout("doSharedAction", { actionType: "showEmbed", actionData: "https://grpmcollections.org/Detail/objects/208991" });

        thisBot.hideTile();

        await os.sleep(10);

        let collectablesLeft = 0;
        let collectableBots = [];

        getBots(b => {
            if (b.tags.collectableTile == true && b.tags.tileCopy == true) {
                collectableBots.push(b);
                if (b.tags.home == true) {
                    collectablesLeft++;
                }
            }
        })

        collectableBots = collectableBots.sort((a, b) => a.tags.timeAdded - b.tags.timeAdded);
        let collectableIndex = collectableBots.findIndex(bot => bot.id === thisBot.id);
        let embeds = links?.controller?.tags?.embeds ? [...links.controller.tags.embeds] : null;

        console.log("embeds",embeds);

        if(embeds){
            let wrappedIndex = ((collectableIndex % embeds.length) + embeds.length) % embeds.length;
            let embedLink = embeds[wrappedIndex];
            embedLink ? shout("doSharedAction", { actionType: "showEmbed", actionData: embedLink }) : null;
            console.log("embed: ", embeds, embedLink);
        }

        

        console.log("collectableBots: ", collectableBots)
        console.log("collectables left: ", collectablesLeft)

        if (collectablesLeft == 0) {
            if (!ab.links.console.masks.open) {
                whisper(ab.links.console, "showConsole");
                ab.links.console.masks.open = true;
            }
            ab.log("The whale found the final artifact. Now they can find their way to the end.")

            shout("allCollectablesGotten");
            console.log("all collectables gotten")
        }
        else {
            if (!ab.links.console.masks.open) {
                whisper(ab.links.console, "showConsole");
                ab.links.console.masks.open = true;
            }
            ab.log("The whale found one of the artifacts.")
        }
    }
    else if (that.tags.harmfulTile == true) {
        if (!ab.links.console.masks.open) {
            whisper(ab.links.console, "showConsole");
            ab.links.console.masks.open = true;
        }
        ab.log("A monster took one of the artifacts, and without it, the whale had to go home and try again.")

        thisBot.hideTile();
        await os.sleep(100);
        shout("restartPuzzle");
    }
}