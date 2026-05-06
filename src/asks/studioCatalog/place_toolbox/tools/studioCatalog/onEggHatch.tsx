console.log(`[${tags.system}.${tagName}] that:`, that, `tags:`, self.structuredClone(thisBot.tags));

thisBot.setup({ data: { eggParameters: that.eggParameters } });