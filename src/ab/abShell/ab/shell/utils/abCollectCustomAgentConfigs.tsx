const collectResults = await Promise.allSettled(shout('onABCollectCustomAgentConfigs'));

const customAgents = [];
for (const result of collectResults) {
    if (result.status === 'fulfilled' && result.value) {
        const agents = Array.isArray(result.value) ? result.value : [result.value];
        customAgents.push(...agents);
    }
}

return customAgents;
