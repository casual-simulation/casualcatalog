// The name that this remote is to be known as to other users.
let remoteName;

if (ab.links.console.masks.preferredName) {
    remoteName = ab.links.console.masks.preferredName;
} else if (authBot && authBot.tags.name) {
    remoteName = authBot.tags.name;
} else {
    remoteName = configBot.id.substring(0,5);
}

return remoteName;