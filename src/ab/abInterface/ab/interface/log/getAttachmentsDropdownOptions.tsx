const list: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];
let addFilesOptions = [];

for (let i = 0; i < list.length; i++) {
    const att = list[i];
    const icon = att.mimeType?.startsWith('image/') ? 'image' : 'insert_drive_file';

    addFilesOptions.push({
        menuItemStyle: {
                width: 'calc(100% - 7px)',
                left: '2px'
            }, 
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

addFilesOptions.push(
        {
            ...menuOptions,
             menuItemStyle: {
                width: 'calc(100% - 7px)',
                left: '2px'
            }, 
            label: 'add photos & files',
            formAddress: 'attach_file',
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
                links.skillBot?.refreshAttachmentsDropdown();
            })
        })

addFilesOptions.push({
            ...menuOptions,
            menuItemStyle: {
                width: 'calc(100% - 7px)',
                left: '2px'
            }, 
            label: 'take a photo',
            formAddress: 'photo_camera',
            onClick: ListenerString(() => {
                ab.links.ask?.onAttachmentsCaptureClick();
            })
        })

addFilesOptions.push(        {
            ...menuOptions,
            menuItemStyle: {
                width: 'calc(100% - 7px)',
                left: '2px'
            }, 
            label: 'scan',
            formAddress: 'qr_code_scanner',
            onClick: `@
                os.openQRCodeScanner();
                configBot.tags.abScan = true;
            `
        }
    )

return addFilesOptions;