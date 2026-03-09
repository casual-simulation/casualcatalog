const menuPortal = configBot.tags.menuPortal ?? "menu";

if (!configBot.tags.menuPortal) {
    configBot.tags.menuPortal = menuPortal;
}

if (thisBot.vars.inputBot) {
    destroy(thisBot.vars.inputBot);
    thisBot.vars.inputBot = null;
}

thisBot.vars.inputBot = ab.links.menu.abCreateMenuInput({
    [menuPortal]: true,
    dimension: menuPortal,
    label: `ask ${tags.agentName ?? tags.aiModel}`,
    color: tags.menuColor,
    labelColor: tags.labelColor,
    promptType: that.prompt,
    agentBotId: thisBot.id,
    agentBot: getLink(thisBot),
    onABAIAgentReset: `@destroy(thisBot)`,
    onSubmit: `@
        links.agentBot.masks.promptType = tags.promptType;
        links.agentBot.onSubmit(that);
    `,
    onAnyBotsRemoved: `@
        const { botIDs } = that;

        if (botIDs.includes(tags.agentBotId)) {
            shout('onABAIAgentReset');
        }
    `,
})

if (that.bot && that.prompt === "bot") {
    masks.targetBot = getLink(that.bot);
}

abRemember.masks.abBuilderIdentity = tags.agentName ?? tags.aiModel;