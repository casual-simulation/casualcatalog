// Single source of truth for the attachments dropdown's contents.
// Returns { options, label } — caller decides where to write them
// (initial menu construction → masks; live mutation → existing header bot).
//
// Options layout: existing attachments first (click to remove), then the attach button at the bottom.

const list: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];

const options: any[] = [];

for (let i = 0; i < list.length; i++) {
    const att = list[i];
    const icon = att.mimeType?.startsWith('image/') ? 'image' : 'insert_drive_file';

    options.push({
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
            ab.links.ask?.refreshAttachmentsDropdown();
        })
    });
}

options.push({
    label: "add photos & files",
    formAddress: "attach_file",
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
        ab.links.ask?.refreshAttachmentsDropdown();
    })
});

options.push({
    label: "take a photo",
    formAddress: "photo_camera",
    onClick: ListenerString(() => {
        ab.links.ask?.onAttachmentsCaptureClick();
    })
});

const label = list.length > 0 ? "add files to ask (" + list.length + ")" : "add files to ask";

return { options, label };
