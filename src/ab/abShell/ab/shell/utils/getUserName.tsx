const {
    canSetPreferredName = false
} = that ?? {};

let username = "user";

if (authBot && authBot.tags.name) {
    username = authBot.tags.name;
} else if (ab.links.console.masks.preferredName) {
    username = ab.links.console.masks.preferredName;
} else {
    if (canSetPreferredName) {
        const usernameInput = await os.showInput("", {
            title: "What would you like me to call you?"
        });

        if (usernameInput) {
            username = usernameInput;
            ab.links.console.masks.preferredName = usernameInput;
        }
    }

    if (!username) {
        // Fallback to a generic anonymous default.
        username = `user ${configBot.id.substring(0, 5)}`;
    }
}

return username;