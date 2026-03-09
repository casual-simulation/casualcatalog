let roleBots = getBots("roleName", (name) => {
    return tags.roleTags.includes(name);
});

if (!tags.roleTags || tags.roleTags.length == 0) {
    roleBots = getBots("simRole", true);
}

for (let i = 0; i < roleBots.length; ++i) {
    if (tags.reactionEffect == 'focus') {
        try {
            const focusBot = getBot('id', tags.reactionValue);
            if (focusBot) {
                await os.focusOn(focusBot);
            }

            console.log(focusBot, tags.reactionValue);

            if (tags.actionStory) {
                ab.log({message: tags.actionStory, space: "shared", name: "sim"});
            } else {
                ab.log({message: "completed: " + tags.label, space: "shared", name: "sim"});
            }

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
            
        } catch (e) {
            console.log("Could not execute camera motion: ", tags.reactionEffect, "with value: ", tags.reactionValue);
        }
    }
}