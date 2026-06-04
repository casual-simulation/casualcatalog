const limit: number = that?.limit ?? 30;

const logBots = getBots(b => b.tags.consoleLogMessageBot && b.space === 'shared' && b.tags.message);

const entries = logBots
    .map(b => ({
        timestamp: b.tags.timestamp ?? 0,
        name: b.tags.name || 'system',
        message: b.tags.message,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

const recent = limit > 0 ? entries.slice(-limit) : entries;

return recent.map(e => ({
    time: typeof e.timestamp === 'number' ? DateTime.fromMillis(e.timestamp).toISO() : e.timestamp,
    name: e.name,
    message: e.message,
}));
