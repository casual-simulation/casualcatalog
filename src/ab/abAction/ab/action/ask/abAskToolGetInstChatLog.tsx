// Query tool: returns the inst's activity log (agent chat replies + user-request notices) as a
// self-describing slice { total, start, count, entries }, reconstructed from the persistent shared
// log bots. Lets an agent see what has already happened/been built and walk back through history.
//
// Args (both optional): count — how many entries to return (default 30); start — absolute index
// from the oldest (0 = oldest); omit start to get the most recent `count`. Indices are stable
// (oldest-anchored), so read older history by requesting a smaller start.
const args = that?.args ?? {};

return thisBot.abAskHelperBuildInstChatLog({ start: args.start, count: args.count });
