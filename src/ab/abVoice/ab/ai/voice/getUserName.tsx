let username = "user";

if (authBot && authBot.tags.name && authBot.tags.name != "") {
    username = authBot.tags.name;
} else if (ab.links.console.masks.preferredName) {
    username = ab.links.console.masks.preferredName;
} else {
    username = await os.showInput("", {
        title: "What would you like me to call you?"
    });
    ab.links.console.masks.preferredName = username;
}

return username;