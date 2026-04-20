/*
   EXAMPLE
   const menuGroup = {
        onClick: `@`,
        ...menuOptions,
        groupSortOrder: 1,
        menuItems: [
            {
                label: "group option 1",
                onClick: `@`,
            },
            {
                label: "group option 2",
                color: "orange",
                onClick: `@`,
            },
            {
                label: "group option 3",
                onClick: `@`,
                menuItemType: "dropdown",
                dropdownOptions: [
                    {
                        label: "option 1",
                        onClick: `@`,
                    },
                    {
                        label: "option 2",
                        onClick: `@`,
                    },
                    {
                        label: "option 3",
                        onClick: `@`,
                    }
                ]
            }
        ]
    }
*/

if  (!that) {
    return;
}

if (!that.groupSortOrder) {
    throw new Error(`abCreateMenuGroup: groupSortOrder is not provided.`);
}

let {
    menuItemStyle = {},
    menuItems = [],
    ...additionalTags
} = that ?? {}

const menuBots = [];
for (let i = 0; i < menuItems.length; ++i) {

    let newMenuButton = {};

    newMenuButton[configBot.tags.menuPortal + "SortOrder"] = Number(that.groupSortOrder) + ((i + 1) / 100);

    let indivMenuItemStyle = menuItems[i].menuItemStyle ?? {};
    let indivMenuType = menuItems[i].menuItemType ?? undefined;
    let indivAdditionalTags = menuItems[i];
    if (indivAdditionalTags["menuItemStyle"]) {
        delete indivAdditionalTags["menuItemStyle"];
    }
    if (indivAdditionalTags["menuItemType"]) {
        delete indivAdditionalTags["menuItemType"];
    }

    const baseStyling = {
        "borderTop": "none",
        "marginTop": "0"
    }

    if (i == menuItems.length - 1 && i == 0) {
        const menuStyling = {
            ...menuItemStyle,
            ...indivMenuItemStyle
        }

        newMenuButton["menuItemStyle"] = menuStyling;
    }
    else if (i == menuItems.length - 1) {
        const menuStyling = {
            ...baseStyling,
            "borderRadius": "0 0 8px 8px",
            ...menuItemStyle,
            ...indivMenuItemStyle
        }

        newMenuButton["menuItemStyle"] = menuStyling;
    } else if (i == 0) {
        const menuStyling = {
            "borderRadius": "8px 8px 0 0",
            ...menuItemStyle,
            ...indivMenuItemStyle
        }

        newMenuButton["menuItemStyle"] = menuStyling;}
    else {
        const menuStyling = {
            ...baseStyling,
            "borderRadius": "0",
            ...menuItemStyle,
            ...indivMenuItemStyle
        }

        newMenuButton["menuItemStyle"] = menuStyling;
    }

    for (const tag in additionalTags)
    {
        newMenuButton[tag] = additionalTags[tag];
    }

    for (const tag in indivAdditionalTags)
    {
        newMenuButton[tag] = indivAdditionalTags[tag];
    }

    let newMenuBot;
    switch(indivMenuType) {
        case "dropdown": 
            await thisBot.abCreateMenuDropdown(
                {
                    ...newMenuButton,
                    "dropdownSortOrder": Number(that.groupSortOrder) + ((i + 1) / 100)
                });
            break;
        case "input": 
            await thisBot.abCreateMenuInput(newMenuButton);
            break;
        case "text": 
            await thisBot.abCreateMenuText(newMenuButton);
            break;
        case "tool": 
            await thisBot.abCreateMenuTool(newMenuButton);
            break;
        case "wizard": 
            await thisBot.abCreateMenuWizard(newMenuButton);
            break;
        default: 
            await thisBot.abCreateMenuButton(newMenuButton);
            break;
    }
    menuBots.push(newMenuBot);
}

return menuBots;