let roleBots = getBots("roleName", (name) => {
    return tags.roleTags.includes(name);
});

if (!tags.roleTags || tags.roleTags.length == 0) {
    roleBots = getBots("simRole", true);
}

for (let i = 0; i < roleBots.length; ++i) {
    if (tags.reactionEffect == '+') {
        try {
            const newValue = Number(roleBots[i].tags.simAttributes[tags.reactionAttribute]) + tags.reactionValue;
            roleBots[i].editAttribute({'attributeName': tags.reactionAttribute, 'value': newValue});

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
            console.log("Could not effect attribute: ", tags.reactionAttribute, "with value: ", tags.reactionValue);
        }

    } else if (tags.reactionEffect == '-') {
        try {
            const newValue = Number(roleBots[i].tags.simAttributes[tags.reactionAttribute]) - tags.reactionValue;
            roleBots[i].editAttribute({'attributeName': tags.reactionAttribute, 'value': newValue});

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
            console.log("Could not effect attribute: ", tags.reactionAttribute, "with value: ", tags.reactionValue);
        }
    } else if (tags.reactionEffect == '=') {
        roleBots[i].editAttribute({'attributeName': tags.reactionAttribute, 'value': tags.reactionValue});
        
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
    } else if (tags.reactionEffect == '==') {
        if (roleBots[i].tags.simAttributes[tags.reactionAttribute] && roleBots[i].tags.simAttributes[tags.reactionAttribute] == tags.reactionValue) {
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
        }
    }

    //handle cue
    ab.cue({
        bot: roleBots[i],
        text: tags.reactionEffect + tags.reactionValue + ' ' + tags.reactionAttribute,
        scale: 1
    })
    if (roleBots[i].tags.simRole) {
        const playerBot = getBot(byTag("simPlayer", true), byTag("chosenRole", roleBots[i].tags.simID));
        if (playerBot) {
            ab.cue({
                bot: playerBot,
                text: tags.reactionEffect + tags.reactionValue + ' ' + tags.reactionAttribute,
                scale: 1
            })
            const avatarBot =  getBot(byTag("simAvatar", true), byTag("remoteID", playerBot.tags.remoteID));
            if (avatarBot) {
                ab.cue({
                    bot: avatarBot,
                    text: tags.reactionEffect + tags.reactionValue + ' ' + tags.reactionAttribute,
                    scale: 1
                }) 
            }
        }
    }
}