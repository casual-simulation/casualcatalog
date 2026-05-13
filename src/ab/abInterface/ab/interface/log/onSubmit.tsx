const menuBot = getBot(byTag("abMenu", true), byTag("baseSkill", getLink(thisBot)));
menuBot.masks.menuItemText = ""; 

if (!ab.links.console.tags.open) {
    ab.links.console.showConsole();
}

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

if (that.text && that.text[0] == ".") {
    ab.links.input.onChat({message: that.text});
}

ab.log({message: that.text, name: username, space: "shared"});