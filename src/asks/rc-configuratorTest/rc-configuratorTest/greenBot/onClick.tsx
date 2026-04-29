const nums = tags.favoriteNumbers ?? [];
const nicknames = tags.nicknames ?? [];
const flags = tags.flags ?? [];
const wps = tags.waypoints ?? [];
const todos = tags.todos ?? [];
const contacts = tags.contacts ?? [];
os.toast(`green bot: ${nums.length} numbers, ${nicknames.length} nicknames, ${flags.length} flags, ${wps.length} waypoints, ${todos.length} todos, ${contacts.length} contacts`);
