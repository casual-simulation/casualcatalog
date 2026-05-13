const menuBot = getBot(byTag("abMenu", true), byTag("baseSkill", getLink(thisBot)));
menuBot.masks.menuItemText = ""; 

if (!ab.links.console.tags.open) {
    ab.links.console.showConsole();
}

const username = await ab.links.console.getUserName({ canSetPreferredName: true });

if (that.text && that.text[0] == ".") {
    ab.links.input.onChat({message: that.text});
}

ab.log({message: that.text, name: username, space: "shared"});