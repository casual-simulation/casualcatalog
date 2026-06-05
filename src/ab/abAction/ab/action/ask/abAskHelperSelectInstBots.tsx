// Shared selector for the inst bots an agent is allowed to see: shared space, excluding ab system
// bots, ignored bots, and todo bots. Centralizes the base filter and the search filters so both
// listInstBots (skeleton index) and getInstBots (full read) stay in sync — change the rules here, once.
//
// Args (all optional):
//   systemTags — a system-tag prefix (or array), matched on dot-segment boundaries (path-like, so
//                'ab.toolbox' matches 'ab.toolbox.*' but not 'ab.toolboxOther').
//   ids        — an exact bot id (or array).
//   hasTags    — a tag name (or array); keeps only bots that HAVE at least one of those tags
//                (presence, not value). E.g. ['onClick'] narrows to clickable bots.
//
// Combination: systemTags and ids are identity selectors and union together (a bot matching either
// passes). hasTags is a separate axis and ANDs with that — so { systemTags:['ab.toolbox'],
// hasTags:['onClick'] } yields clickable bots under ab.toolbox. With no args, returns every visible bot.
const args = that ?? {};
const toArray = (v) => (Array.isArray(v) ? v : (v != null ? [v] : null));
const prefixes = toArray(args.systemTags);
const ids = toArray(args.ids);
const hasTags = toArray(args.hasTags);

const matchesPrefix = (sys) =>
    typeof sys === 'string' &&
    prefixes.some((p) => sys === p || sys.startsWith(p + '.'));

const matchesIdentity = (b) =>
    (!prefixes && !ids) || // no identity filter → passes this axis
    (prefixes && matchesPrefix(b.tags.system)) ||
    (ids && ids.includes(b.id));

const matchesTags = (b) =>
    !hasTags || hasTags.some((t) => t in b.tags); // has ANY of the named tags

const bots = getBots((b) => {
    return b.space === 'shared' && // Only include shared bots.
           !b.tags.abIgnore && // Ignore bots that should be ignored.
           !b.tags.abBot && // Ignore ab bots.
           !b.tags.abPatchTodoInstance; // Ignore todo bots.
});

return bots.filter((b) => matchesIdentity(b) && matchesTags(b));
