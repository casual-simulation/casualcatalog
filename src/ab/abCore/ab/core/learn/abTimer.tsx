if (getBot("abTimer", true)) {
    return;
}

if (!tags.abXP) {
    setTagMask(thisBot, "abXP", "0", "local");
}

let timerBot = {};

timerBot.space = "tempLocal";
timerBot.manager = getLink(thisBot);
timerBot.onCreate = `@
    masks.interval = setInterval(() => thisBot.onTimeCheck(), 60000);
`;
timerBot.abTimer = true;
timerBot.onTimeCheck = `@
    if (tags.notIdle) {
        tags.notIdle = false;

        //console.log("XP", links.manager.tags.abXP);

        const totalXP = links.manager.tags.abXP + 1;

        setTagMask(links.manager, "abXP", totalXP, "local");
    }
`;
timerBot.notIdle = false;
timerBot.onAnyAction = `@
    if (!tags.notIdle) {
        if (that.action.id == gridPortalBot.id)
        {
            tags.notIdle = true;
        }
    }
`;

let abTimer = create(timerBot);

globalThis.abTimer = abTimer;