let {
    remotes, // Optional: remotes to send shout to. Will default to all remotes if not provided.
    name, // Required: name of the shout
    arg, // Optional: arg to pass to the shout
} = that;

assert(name, `[${tags.system}.${tagName}] name is a required parameter.`);

if (os.isCollaborative()) {
    if (!remotes) {
        remotes = (await os.remotes()).filter(id => id !== configBot.id);
    }

    // Send shout data to remotes.
    sendRemoteData(remotes, 'ab_remote_shout', { name, arg });
}

// Shout locally.
shout(name, arg);