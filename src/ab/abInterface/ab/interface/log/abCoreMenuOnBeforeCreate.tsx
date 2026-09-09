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
    label: 'log anything',
    menuItemStyle: {
        width: 'calc(100% - 52px)',
        marginLeft: '47px',
        borderRadius: '0px 8px 8px 0px',
        "border-left": `0px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`,
        "anchor-name": '--log-input',
        "z-index": "2"
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

const filesDropdownOptions = thisBot.getAttachmentsDropdownOptions();

let addFiles = {
    ...menuOptions,
    formAddress: "add",
    abLogAddDropdownBot: true,
    menuItemType: 'dropdown',
    menuItemStyle: {
        width: '50px',
        "min-height": 'calc(anchor-size(height))',
        height: 'calc(anchor-size(height))',
        borderRadius: '8px 0px 0px 8px',
        position: 'absolute',
        top: 'anchor(top)',
        right: 'calc(anchor(left) - 5px)',
        'position-anchor': '--log-input',
        "border-top": `2px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`,
        "border-right": `0px solid ${abPersonality.tags.abBaseShadowColor ?? "#000"}`,
        "box-shadow": `3px 4px 0 0px ${abPersonality.tags.abBaseShadowColor ?? "#000" }`,
        "z-index": '1'
    }, 
    abLogInputMenuTextChanged: `@
        if (that) {
            let newMenuItemStyle = {...tags.menuItemStyle};
            newMenuItemStyle["height"] = 'calc(anchor-size(height))',
            newMenuItemStyle["min-height"] = 'calc(anchor-size(height))'
            tags.menuItemStyle = newMenuItemStyle;
        } else {
            let newMenuItemStyle = {...tags.menuItemStyle};
            newMenuItemStyle["height"] = '40px',
            newMenuItemStyle["min-height"] = '40px'
            tags.menuItemStyle = newMenuItemStyle;
        }
    `,
    dropdownSortOrder: 3.5,
    dropdownOptions: filesDropdownOptions
}

dropdownOptions.push(inputButton)
dropdownOptions.push(addFiles);

masks.menuItems = dropdownOptions;
