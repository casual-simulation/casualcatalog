const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

const username = await ab.links.console.getUserName({ canSetPreferredName: false });
if (username) {
    masks.abCoreMenuLabel = username + "'s guide";
}

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.clearTeleprompterMenu = `@destroy(thisBot)`;
menuOptions.skillBot = getLink(thisBot);
menuOptions.guide = tags.guide;

const inputButton = {
    ...menuOptions,
    menuItemType: "input",
    abGuideInputBox: true,
    onInputTyping: `@
        shout("resetGuideOptionsSelectionState");
    `,
    onSubmit: `@
        links.guide.submitAIRequest(that.text);
    `
}

dropdownOptions.push(inputButton)

let addFiles = {
    ...menuOptions,
    label: "add",
    menuItemType: 'dropdown',
    dropdownSortOrder: 3.5,
    formAddress: 'add',
    dropdownOptions: [
        {
            ...menuOptions,
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
                ab.links.ask?.refreshAttachmentsDropdown();
            })
        },
        {
            ...menuOptions,
            label: 'take a photo',
            formAddress: 'photo_camera',
            onClick: ListenerString(() => {
                ab.links.ask?.onAttachmentsCaptureClick();
            })
        },
        {
            ...menuOptions,
            label: 'scan',
            formAddress: 'qr_code_scanner',
            onClick: `@
                os.openQRCodeScanner();
                configBot.tags.abScan = true;
            `
        }
    ]
}
dropdownOptions.push(addFiles);

masks.dropdownOptions = dropdownOptions;