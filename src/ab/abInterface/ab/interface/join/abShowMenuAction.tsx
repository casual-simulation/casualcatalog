const menuBot = getBot(byTag("abMenu", true), byTag("baseSkill", "🔗" + thisBot.id))
ab.abCreateHost(menuBot);
if (!ab.links.remember.tags.hostID) {
    tags.label = 'generating code now';
}