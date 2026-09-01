const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.clearTeleprompterMenu = `@destroy(thisBot)`;
menuOptions.skillBot = getLink(thisBot);
menuOptions.guide = tags.guide;

const inputButton = {
    ...menuOptions,
    menuItemStyle: {
        width: 'calc(100% - 52px)',
        marginLeft: '47px',
        borderRadius: '0px 8px 8px 0px',
        "border-left": `0px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`,
        "anchor-name": '--log-input'
    },
    menuItemType: "input",
    abGuideInputBox: true,
    onInputTyping: `@
        shout("resetGuideOptionsSelectionState");
    `,
    onSubmit: `@
        links.guide.submitAIRequest(that.text);
    `,
    abMenuDropdownOpened: `@
        if (that.tags.abLogAddDropdownBot) {
            let newMenuItemStyle = {...tags.menuItemStyle};
            newMenuItemStyle["borderRadius"] = '0px 8px 0px 0px'
            tags.menuItemStyle = newMenuItemStyle;
        }
    `,
    abMenuDropdownClosed: `@
        if (that.tags.abLogAddDropdownBot) {
            let newMenuItemStyle = {...tags.menuItemStyle};
            newMenuItemStyle["borderRadius"] = '0px 8px 8px 0px'
            tags.menuItemStyle = newMenuItemStyle;
        }
    `,
    onBotChanged: `@
        if (that.tags.includes("menuItemText") {
            shout("abLogInputMenuTextChanged", tags.menuItemText);
        }
    `
}

let addFiles = {
    ...menuOptions,
    formAddress: "add",
    abLogAddDropdownBot: true,
    menuItemType: 'dropdown',
    menuItemStyle: {
        width: '50px',
        "min-height": 'calc(anchor-size(height) + 4px)',
        height: 'calc(anchor-size(height) + 4px)',
        borderRadius: '8px 0px 0px 8px',
        position: 'absolute',
        top: 'anchor(top)',
        right: 'calc(anchor(left) - 5px)',
        'position-anchor': '--log-input',
        "box-shadow": 'none',
        "border-top": `2px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`,
        "border-bottom": `6px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`,
        "border-right": `0px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`
    }, 
    abLogInputMenuTextChanged: `@
        if (that) {
            let newMenuItemStyle = {...tags.menuItemStyle};
            newMenuItemStyle["height"] = 'calc(anchor-size(height) + 4px)',
            newMenuItemStyle["min-height"] = 'calc(anchor-size(height) + 4px)'
            tags.menuItemStyle = newMenuItemStyle;
        } else {
            let newMenuItemStyle = {...tags.menuItemStyle};
            newMenuItemStyle["height"] = '40px',
            newMenuItemStyle["min-height"] = '40px'
            tags.menuItemStyle = newMenuItemStyle;
        }
    `,
    dropdownSortOrder: 3.5,
    dropdownOptions: [
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
                ab.links.ask?.refreshAttachmentsDropdown();
            })
        },
        {
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
        },
        {
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
    ]
}

dropdownOptions.push(inputButton)
dropdownOptions.push(addFiles);

masks.menuItems = dropdownOptions;