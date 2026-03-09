//manual hatch menu
const ovoBot = that ? that : links.ovoBot;

if (!ovoBot) {
    return;
}

shout("ovoMenuReset");

configBot.masks.menuPortal = "abOvoMenu";

masks.onGridClick = `@
    shout("ovoMenuReset");
`;
masks.ovoMenuReset = `@
    masks.onGridClick = null;
    masks.ovoMenuReset = null;

    configBot.masks.menuPortal = null;
`;

os.tweenTo(ovoBot, 15,45,45, 5);

const eggMenuButton = {
    abOvoMenu: true,
    manager: getLink(thisBot),
    ovoBot: getLink(ovoBot),
    color: abPersonality.tags.abBaseColor,
    targetVersion: ovoBot.tags.targetVersion,
    label: `hatch ${ovoBot.tags.abID} v${ovoBot.tags.targetVersion} of ${ovoBot.tags.maxVersion}`,
    labelAlignment: "center",
    ovoMenuReset: `@
        destroy(thisBot);
    `,
    onClick: `@
        links.manager.hatchOvo(links.ovoBot);
    `,
};

links.menu.abCreateMenuButton(eggMenuButton);