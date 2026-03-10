if (!authBot) {
    await os.requestAuthBot();

    if (!authBot) {
        os.toast("please login to participate");
        return;
    }
}

setTagMask(thisBot, "scaleZ", 0.01, "tempShared");
setTagMask(thisBot, "formOpacity", 1, "tempShared");
setTagMask(thisBot, "remoteID", getID(configBot), "tempShared");
setTagMask(thisBot, "chosenRole", that, "tempShared");
setTagMask(thisBot, "label", authBot.tags.name, "tempShared");

const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));
setTagMask(simXPBot, "chosenRole", that, "tempShared");

const roleBot = getBot("simID", that);
roleBot.addRoleOwner();

//create sim avatar
const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", getID(configBot)));

if (!avatarBot) {
    const abArtifactShard = {
        data: {
            eggParameters: {
                gridInformation: {
                    dimension: roleBot.tags.defaultPlace ?? tags.dimension,
                    position: {
                        x: tags[tags.dimension + 'X'],
                        y: tags[tags.dimension + 'Y']
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'simAvatar'
            }
        ]
    };
    const avatar = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'simAvatar',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    tags.avatar = getLink(avatar);
}

if (roleBot.tags.defaultPlace) {
    configBot.tags.gridPortal = roleBot.tags.defaultPlace;
}

if (!simXPBot) {
    
    //create XP bot
    if (!authBot) {
        await os.requestAuthBotInBackground();
    }

    if (!authBot) {
        os.toast("user not logged in.");
        return;
    }
    const abArtifactShard = {
        data: {
            chosenRole: that,
            simUser: authBot.id
        },
        dependencies: [
            {
                askID: 'simXP'
            }
        ]
    };
    const xpBot = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'simXP',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    tags.simXP = getLink(xpBot);
} else {
    tags.simXP = getLink(simXPBot);
}