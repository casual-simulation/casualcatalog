const args = that?.args ?? {};

const bots = thisBot.abAskHelperSelectInstBots({ systemTags: args.systemTags, ids: args.ids, hasTags: args.hasTags });

return bots.map((b) => ({ id: b.id, tags: b.tags }));
