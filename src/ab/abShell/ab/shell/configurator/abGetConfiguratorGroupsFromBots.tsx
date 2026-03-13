interface ABGetConfiguratorGroupsFromBotsArg {
    bots?: Bot[];
}

const { bots: incomingBots } = that as ABGetConfiguratorGroupsFromBotsArg ?? {};

const bots = incomingBots ?? getBots((b) => b.tags.abConfiguratorGroup != null);

const groups: Record<string, Bot[]> = {};

for (const bot of bots) {
    const group = bot.tags.abConfiguratorGroup;
    if (group == null) continue;

    if (groups[group] == null) {
        groups[group] = [];
    }

    groups[group].push(bot);
}

return groups;