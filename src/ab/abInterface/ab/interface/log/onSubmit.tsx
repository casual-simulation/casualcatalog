const menuBot = getBot(byTag("abMenu", true), byTag("baseSkill", getLink(thisBot)));
menuBot.masks.menuItemText = ""; 

if (!ab.links.console.masks.open) {
    ab.links.console.showConsole();
}

const username = await ab.links.console.getUserName({ canSetPreferredName: true });

let writeToLogRecord = true;

if (that.text && that.text[0] == ".") {
    ab.links.input.onChat({message: that.text});
    writeToLogRecord = false;
}

ab.log({message: that.text, name: username, space: "shared"});

if (writeToLogRecord) {
    ab.links.log_record.abWriteToLogRecord({ content: that.text });
}