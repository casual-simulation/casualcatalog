const { abArtifactBot } = that ?? {};

assert(abArtifactBot && abArtifactBot.space && abArtifactBot.tags, `[${tags.system}.${tagName}] abArtifactBot is a required to be a Bot.`);

shout("abArtifactBotMenuReset");

configBot.masks.menuPortal = "abArtifactMenu";

if (!thisBot.vars.artifactMenuBots) {
    thisBot.vars.artifactMenuBots = [];
}

const abArtifactBaseColor = links.remember.tags.abArtifactBaseColor ?? tags.abArtifactBaseColorDefault;
const abArtifactLabelColor = links.remember.tags.abArtifactLabelColor ?? tags.abArtifactLabelColorDefault;

const abArtifactBundle: ABArtifactBundle = abArtifactBot.tags.abArtifactBundle;

let infoLabel = `[artifact name]: ${abArtifactBundle.name}\n`;
infoLabel += `[artifact id]: ${abArtifactBundle.id.substring(0, 7)}\n`;
infoLabel += `[artifact instance id]: ${abArtifactBot.tags.abArtifactInstanceID ?? 'unset'} \n`;
infoLabel += `[artifact instance owner]: ${abArtifactBot.tags.abArtifactInstanceOwner ?? 'unset'} \n`;
infoLabel += `[reconstituted in inst]: ${abArtifactBot.tags.abArtifactShardReconstituted}\n`;
infoLabel += `[format]: v${abArtifactBundle.formatVersion}\n`;
infoLabel += `[created time]: ${DateTime.fromISO(abArtifactBundle.createdTimestamp).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}\n`;

// Header
const infoBot = links.menu.abCreateMenuText({
    abArtifactMenu: true,
    label: infoLabel,
})
thisBot.vars.artifactMenuBots.push(infoBot);

// Download shard button.
const downloadButton = links.menu.abCreateMenuButton({
    abArtifactMenu: true,
    abArtifactBot: getLink(abArtifactBot),
    abArtifactTool: getLink(thisBot),
    formAddress: 'download',
    label: `download shard`,
    color: abArtifactBaseColor,
    onClick: `@
        const abArtifactBundle = links.abArtifactBot.tags.abArtifactBundle;
        const filename = 'abArtifact-' + abArtifactBundle.name + '-' + abArtifactBundle.id.substring(0,7) + '.aux'; 
        os.downloadBots([ links.abArtifactBot ], filename);
        
        links.abArtifactTool.abArtifactBotMenuReset();
    `,
})
thisBot.vars.artifactMenuBots.push(downloadButton);

// Update artifact button.
const updateButton = links.menu.abCreateMenuButton({
    abArtifactMenu: true,
    abArtifactBot: getLink(abArtifactBot),
    abArtifactTool: getLink(thisBot),
    formAddress: 'sync',
    label: `update artifact`,
    color: abArtifactBaseColor,
    onClick: `@
        const abArtifactBundle = links.abArtifactBot.tags.abArtifactBundle;
        const abArtifactName = abArtifactBundle.name;
        const abArtifactInstanceID = links.abArtifactBot.tags.abArtifactInstanceID;
        const abArtifactInstanceOwner = links.abArtifactBot.tags.abArtifactInstanceOwner;
        
        await links.abArtifactTool.abUpdateArtifactShards({ abArtifactName, abArtifactInstanceID, abArtifactInstanceOwner });

        links.abArtifactTool.abArtifactBotMenuOpen({ abArtifactBot: links.abArtifactBot });
    `,
})
thisBot.vars.artifactMenuBots.push(updateButton);

masks.selectedArtifactBotId = abArtifactBot.id;