const { 
    abID,
    studio,
    initialBoot,
    spaceMod,
    dimMod,
    eggData,
    eggParameters,
    onPreprocessBeforeCreate,
    sourceEvent,
} = that;

//egg visualization
shout("abMenuReset");

if (links.manifestation) {
    if (links.manifestation.links.abBot && !configBot.tags.abStayAwake) {
        destroy(links.manifestation.links.abBot);
    }
}

if (links.ovoBot) {
    destroy(links.ovoBot);
}

let eggMod = {
    space: "tempLocal",
    initialTimer: true,
    abID,
    studio,
    initialBoot,
    eggParameters,
    sourceEvent,
    cursor: 'pointer',
    manager: getLink(thisBot),
    onClick: `@
        links.manager.interactOvo();
    `,
    form: "egg",
    color: links.personality.tags.abBaseColor,
    labelColor: links.remember.tags.abBaseLabelColor,
    progressBarColor: links.remember.tags.abBaseAccentColor,
    progressBarBackgroundColor: links.personality.tags.abBaseColor,
    labelSize: 0.5,
    onPointerEnter: `@
        masks.tipId = await os.tip(tags.abID + ' v' + tags.targetVersion);
    `,
    onPointerExit: `@
        if (masks.tipId) {
            os.hideTips(masks.tipId);
        }
    `,
    labelPosition: "front",
    orientationMode: "billboardFront",
    onDestroy: `@
        links.manager.masks.ovoBot = null;
    `,
    eggTimer: `@
        if (tags.progressBar < 1) {
            tags.progressBar += 0.1;

            setTimeout(() => {whisper(thisBot, "eggTimer");}, 75);
        } else {
            thisBot.onClick();
            
            tags.progressBar = null;
        }
    `
};


const ovo = await create(eggData, eggMod, dimMod, spaceMod);
masks.ovoBot = getLink(ovo);

if (onPreprocessBeforeCreate) {
    ovo.vars.onPreprocessBeforeCreate = onPreprocessBeforeCreate;
}

if (ovo.tags.autoHatch) {
    const hatchedBots = await thisBot.hatchOvo(ovo);
    return { hatchedBots };
}
else {
    ovo.tags.progressBar = 0;
    configBot.tags.version = ovo.tags.maxVersion;
    setTimeout(() => { whisper(ovo, "eggTimer"); }, 75);
}