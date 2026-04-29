// Initial build of the attachments dropdown options, called from each `{menuType}OnBeforeCreate`
// during menu construction. After the menu is live, mutations go through `refreshAttachmentsDropdown`
// which rebuilds the option list in place without closing the dropdown.

const menuType: string = that.menuType;
const list: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];

if (list.length > 0) {
    setTagMask(thisBot, menuType + "Label", "attachments (" + list.length + ")");
} else {
    setTagMask(thisBot, menuType + "Label", "attachments");
}

const dropdownOptions: any[] = [];

// Existing attachments — click to remove.
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

// Attach button at the bottom of the list.
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

masks.dropdownOptions = dropdownOptions;
