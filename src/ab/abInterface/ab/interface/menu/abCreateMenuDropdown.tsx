if (!that) {
    return;
}

if (that.dropdownSortOrder == null) {
    throw new Error(`abCreateMenuDropdown: dropdownSortOrder is not provided.`);
}

let outerMenuButton = {
    ...that,
    formAddress: that.formAddress ?? "arrow_right",
    dropdownOpen: false,
    onBotAdded: `@
        thisBot.updateStyle();
    `,
    onClick: `@
        tags[configBot.tags.menuPortal + "SortOrder"] = ${that.dropdownSortOrder}
        if (tags.dropdownOpen == true) {
            whisper(thisBot.links.menuBots, "clearDropdownMenu");
            tags.dropdownOpen = false;
        } else {
            if (thisBot.vars.generateMenuOptions) {
                thisBot.vars.generateMenuOptions(tags.dropdownOptions, tags.dropdownSortOrder);
                tags.dropdownOpen = true;
            }
        }
    `,
    onDestroy: `@
        whisper(thisBot.links.menuBots, "clearDropdownMenu");
    `,
    updateStyle: `@
        masks.menuItemStyle = null;
        if (!tags.customFormAddress) {
            masks.formAddress = "arrow_right";
        }
        if (tags.dropdownOpen) {
            if (!tags.customFormAddress) {
                setTagMask(thisBot, "formAddress", "arrow_drop_down");
            }
            setTagMask(thisBot, "menuItemStyle", {...tags.menuItemStyle, "borderBottomLeftRadius": "0", "borderBottomRightRadius": "0"});
        } else {
            masks.formAddress = null;
        }
    `,
    onBotChanged: `@
        if (that.tags.includes('dropdownOpen')) {
            thisBot.updateStyle();
            if (tags.dropdownOpen == true) {
                shout("abMenuDropdownOpened", thisBot);
            }
        }
    `,
    abMenuDropdownOpened: `@
        if (tags.ignoreOpenDropdownRules == true) {
            return;
        }
        if (that != thisBot) {
            whisper(thisBot.links.menuBots, "clearDropdownMenu");
            tags.dropdownOpen = false;
            masks.menuItemStyle = null;
        } else {
            if (links && links.baseSkill) {
                setTagMask(ab.links.remember, "lastOpenedDropdown", tags.baseSkill);
            }
        }
    `
};

if (that.formAddress && that.formAddress != "arrow_right") {
    outerMenuButton.customFormAddress = true;
}
outerMenuButton[configBot.tags.menuPortal + "SortOrder"] = that.dropdownSortOrder;

const menuBot = await thisBot.abCreateMenuButton(outerMenuButton);
menuBot.vars.generateMenuOptions = generateMenuOptions;

async function generateMenuOptions (options, sortOrder) {
    const menuBots = [];
    for (let i = 0; i < options.length; ++i) {

        let newMenuButton = {
            ...options[i],
            abDropdownOption: true,
            clearDropdownMenu: `@
                destroy(thisBot);
            `
        };

        newMenuButton[configBot.tags.menuPortal + "SortOrder"] = Number(sortOrder) + ((i + 1) / 1000);
        newMenuButton[configBot.tags.menuPortal] = true;

        if (i == options.length - 1) {
            if (newMenuButton["menuItemStyle"]) {
                newMenuButton["menuItemStyle"]["borderRadius"] = "0 0 8px 8px";
            } else {
                newMenuButton["menuItemStyle"] = {
                    borderRadius: "0 0 8px 8px"
                }
            }
            
        } else {
            if (newMenuButton["menuItemStyle"]) {
                newMenuButton["menuItemStyle"]["borderRadius"] = "0";
            } else {
                newMenuButton["menuItemStyle"] = {
                    borderRadius: "0"
                }
            }
        }

        newMenuButton["menuItemStyle"]["borderTop"] = "none";
        newMenuButton["menuItemStyle"]["marginTop"] = "0";
        newMenuButton["menuItemStyle"]["paddingLeft"] = "35px";

        const newMenuBot = await thisBot.abCreateMenuButton(newMenuButton);
        menuBots.push(newMenuBot);
    }

    menuBot.tags.menuBots = getLink(menuBots);
}

if (that.defaultOpen) {
    menuBot.onPointerUp();
    menuBot.onClick();
}

return menuBot;

