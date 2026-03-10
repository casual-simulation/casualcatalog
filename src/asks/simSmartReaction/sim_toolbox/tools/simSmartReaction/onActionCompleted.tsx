if (!authBot) {
    await os.requestAuthBotInBackground();
}
if (!authBot) {
    os.toast("user not logged in.");
    return;
}
const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));
const actionQueue = [...simXPBot.tags.queuedActions];
actionQueue.push({
    id: that.tags.simID,
    origin: 'unknown'
})
const actionLog = [...simXPBot.tags.completedActions];
actionLog.push(that.tags.simID);

if (tags.manualFunction && thisBot.raw.manualFunction != '@') {
    try {
        const result = thisBot.manualFunction;
        if (result == true) {
            if (configBot.tags.staticInst) {
                shout("onRemoteData", {
                    name: "onActionCompleted",
                    that: tags.simID,
                    remoteId: getID(configBot)
                });
            } else {
                const remotes = await os.remotes();
                await sendRemoteData(remotes, "onActionCompleted", tags.simID);
            }
            
            if (tags.actionStory) {
                ab.log({message: tags.actionStory, space: "shared", name: "sim"});
            } else {
                ab.log({message: "completed: " + tags.label, space: "shared", name: "sim"});
            }
        } 
        return;
    } catch {
        console.log("manual function failed to return a usable result", tags.simID);
    }
}

if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that?.tags?.simID)) {
    let requirementsMet = true;
    let foundIndexCheck = [];
    for (let i = 0; i < tags.actionTriggers.length; ++i) {
        let foundAction = false;
        
        if (tags.checkQueue) {
            
            foundAction = actionQueue.find(action => action.id == tags.actionTriggers[i]);
            if (foundAction) {
                foundIndexCheck.push(actionQueue.findIndex(action => action.id == tags.actionTriggers[i]));
            }
            console.log(actionQueue, foundAction, tags.actionTriggers[i]);
            
        } else {
            foundAction = actionLog.includes(tags.actionTriggers[i]);
            if (foundAction) {
                foundIndexCheck.push(actionLog.indexOf(tags.actionTriggers[i]));
            }
        }
        
        if (!foundAction) {
            requirementsMet = false;
            break;
        }

        if (tags.orderMatters) {
            for (let j = 0; j < foundIndexCheck.length; ++j) {
                if (j == 0) {
                    continue;
                }

                if (foundIndexCheck[j] < foundIndexCheck[j - 1]) {
                    requirementsMet = false;
                    break;
                }
            }
        }

        if (tags.sequentialMatters) {
            for (let j = 0; j < foundIndexCheck.length; ++j) {
                if (j == 0) {
                    continue;
                }

                if (foundIndexCheck[j] < foundIndexCheck[j - 1]) {
                    requirementsMet = false;
                    break;
                } else {
                    if (foundIndexCheck[j] - foundIndexCheck[j - 1] > 1) {
                        requirementsMet = false;
                        break;
                    }
                }
            }
        }
    }
    
    if (requirementsMet) {
        if (configBot.tags.staticInst) {
            shout("onRemoteData", {
                name: "onActionCompleted",
                that: tags.simID,
                remoteId: getID(configBot)
            });
        } else {
            
            const remotes = await os.remotes();
            await sendRemoteData(remotes, "onActionCompleted", tags.simID);
        }
        
        if (tags.actionStory) {
            ab.log({message: tags.actionStory, space: "shared", name: "sim"});
        } else {
            ab.log({message: "completed: " + tags.label, space: "shared", name: "sim"});
        }
    } 
}