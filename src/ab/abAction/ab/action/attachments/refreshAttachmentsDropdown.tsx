// Rebuilds the attachments dropdown's options in place without tearing down the parent menu.
// Called from the attach/remove option click handlers so the dropdown stays open across mutations.
//
// Flow:
//   1. Recompute options + header label from the current vars.abAttachments
//   2. Find the live dropdown header menu bot (it has baseSkill linking to thisBot, the skill bot)
//   3. Destroy the existing option menu bots via the dropdown's clearDropdownMenu listener
//   4. Update the header's dropdownOptions tag and re-run generateMenuOptions to render the new set

const list: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];

const dropdownOptions: any[] = [];

for (let i = 0; i < list.length; i++) {
    const att = list[i];
    const icon = att.mimeType?.startsWith('image/') ? 'image' : 'insert_drive_file';

    dropdownOptions.push({
        label: att.name,
        formAddress: icon,
        attachmentIndex: i,
        onClick: ListenerString(() => {
            const idx = tags.attachmentIndex;
            const current: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];
            if (typeof idx === 'number' && idx >= 0 && idx < current.length) {
                current.splice(idx, 1);
                if (ab.links.ask) {
                    ab.links.ask.vars.abAttachments = current;
                }
            }
            const skillBot = getBot('system', 'ab.action.attachments');
            if (skillBot) {
                whisper(skillBot, 'refreshAttachmentsDropdown');
            }
        })
    });
}

dropdownOptions.push({
    label: "attach file",
    formAddress: "add",
    onClick: ListenerString(async () => {
        const files = await os.showUploadFiles();
        if (!files || files.length === 0) {
            return;
        }
        const current: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];
        for (const file of files) {
            let base64: string;
            if (typeof file.data === 'string') {
                base64 = file.data;
            } else {
                base64 = bytes.toBase64String(new Uint8Array(file.data));
            }
            current.push({ name: file.name, mimeType: file.mimeType, base64 });
        }
        if (ab.links.ask) {
            ab.links.ask.vars.abAttachments = current;
        }
        const skillBot = getBot('system', 'ab.action.attachments');
        if (skillBot) {
            whisper(skillBot, 'refreshAttachmentsDropdown');
        }
    })
});

// Update header label across whichever menu portal is active.
const menuPortal = configBot.tags.menuPortal;
const labelTag = menuPortal + "Label";
const labelText = list.length > 0 ? "attachments (" + list.length + ")" : "attachments";
setTagMask(thisBot, labelTag, labelText);

// Find the live dropdown header bot for this skill in the active menu.
const skillLink = getLink(thisBot);
const dropdownHeader = getBot(byTag('baseSkill', skillLink), byTag(menuPortal, true));

if (dropdownHeader) {
    if (dropdownHeader.links.menuBots) {
        whisper(dropdownHeader.links.menuBots, 'clearDropdownMenu');
    }
    dropdownHeader.tags.dropdownOptions = dropdownOptions;
    if (dropdownHeader.tags.dropdownOpen && dropdownHeader.vars.generateMenuOptions) {
        await dropdownHeader.vars.generateMenuOptions(dropdownOptions, dropdownHeader.tags.dropdownSortOrder);
    }
}
