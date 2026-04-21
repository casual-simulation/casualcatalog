const groups: Record<string, Bot[]> = ab.links.configurator.abGetConfiguratorGroupsFromBots();
return { success: true, groups: Object.keys(groups) };
