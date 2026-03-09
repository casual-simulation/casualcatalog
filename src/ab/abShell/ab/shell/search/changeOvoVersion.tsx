//logic for version changing when manually hatching an ab
const ovoBot = links.ovoBot;

let newVersion = await os.showInput(ovoBot.tags.targetVersion, {
    placeholder: "enter a version from 1 to " + ovoBot.tags.maxVersion
});

ovoBot.tags.targetVersion = newVersion;
ovoBot.tags.label = 'v'+ newVersion;

configBot.tags.version = newVersion;

shout("ovoMenuReset");