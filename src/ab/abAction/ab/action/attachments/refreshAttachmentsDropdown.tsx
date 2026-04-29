// In-place refresh of the attachments dropdown. Called from option click handlers after they
// mutate vars.abAttachments. Finds the live dropdown header bot, updates its label and option
// list directly, and re-renders option menu bots without closing the parent menu.

const { options, label } = thisBot.getAttachmentsDropdownOptions();

const menuPortal = configBot.tags.menuPortal;
const skillLink = getLink(thisBot);
const dropdownHeader = getBot(byTag('baseSkill', skillLink), byTag(menuPortal, true));

if (!dropdownHeader) {
    return;
}

// Update header label directly — abOpenMenu only reads the skill's masked label at construction time,
// so the live header bot needs its own tag updated to reflect the new attachment count.
dropdownHeader.tags.label = label;
dropdownHeader.tags.dropdownOptions = options;

if (dropdownHeader.links.menuBots) {
    whisper(dropdownHeader.links.menuBots, 'clearDropdownMenu');
}

if (dropdownHeader.tags.dropdownOpen && dropdownHeader.vars.generateMenuOptions) {
    await dropdownHeader.vars.generateMenuOptions(options, dropdownHeader.tags.dropdownSortOrder);
}
