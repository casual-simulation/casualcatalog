const {
    canSetPreferredName = false
} = that ?? {};

let username = "user";

if (authBot && authBot.tags.name) {
    username = authBot.tags.name;
} else if (masks.preferredName) {
    username = masks.preferredName;
} else {
    if (canSetPreferredName) {
        const usernameInput = await os.showInput("", {
            title: "What would you like me to call you?"
        });

        if (usernameInput) {
            username = usernameInput;
            masks.preferredName = usernameInput;
        }
    }

    if (!username) {
        // Fallback to a generic anonymous default.
        username = `user ${configBot.id.substring(0, 5)}`;
    }
}

return username;