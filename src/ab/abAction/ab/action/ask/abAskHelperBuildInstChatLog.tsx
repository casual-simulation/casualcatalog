// Reconstructs the inst's activity log from the persistent shared log bots that abLog creates
// (agent `chat` replies + user-request notices are logged space:'shared', so they survive across
// conversation threads — unlike abConversationHistory, which is cleared when a plan completes).
//
// Returns a self-describing, paginated slice: { total, start, count, entries }. Entries are ordered
// OLDEST-first and indexed by absolute position from the oldest (index 0 = oldest). Because new
// entries always append at the newest end, these indices are STABLE — an entry keeps its index as
// the log grows, so agents can walk history reliably.
//
//   - count: how many entries to return (default 30).
//   - start: absolute index (from oldest) to begin at. Omit to get the most recent `count` entries
//            (the returned `start` reports where they sit). start: 0 is the oldest entry.
//
// To read older history, request a smaller start (e.g. previous start − count). total reports how
// many entries exist in all.
//
// Reused by the first-turn injection in askGPT and by the getInstChatLog tool.
const logBots = getBots(b => b.tags.consoleLogMessageBot && b.space === 'shared' && b.tags.message);

const sorted = logBots
    .map(b => ({
        timestamp: typeof b.tags.timestamp === 'number' ? b.tags.timestamp : 0,
        name: b.tags.name || 'system',
        message: b.tags.message,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

const total = sorted.length;
const count: number = Math.max(0, that?.count ?? 30);

// Default (no start): the most recent `count` entries (the tail). Explicit start: absolute index.
const start: number = that?.start != null
    ? Math.max(0, Math.min(that.start, total))
    : Math.max(0, total - count);

const page = sorted.slice(start, start + count).map(e => ({
    time: e.timestamp ? DateTime.fromMillis(e.timestamp).toISO() : null,
    name: e.name,
    message: e.message,
}));

return { total, start, count: page.length, entries: page };
