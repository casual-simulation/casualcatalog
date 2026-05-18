await os.requestAuthBotInBackground();

configBot.masks.menuPortal = "abMenu";

let menuType = that ? "ab" + that.charAt(0).toUpperCase() + that.slice(1) + "Menu": "abCoreMenu"; //set up a check to see what type of menu should be occuring [core, bot, grid, inst]
let menuSkills = getBots(menuType + "Action");
let maxOptions = menuType == "inst" ? 7 : 5;

const BASE_TAGS = {
    abMenu: true,
    remember: tags.remember,
    personality: tags.personality,
    manifestation: tags.manifestation,
    abMenuRefresh: "@ destroy(thisBot);",
    onClick: `@ links.baseSkill.${menuType + "Action"}({bot: thisBot});`,
};

let sortOrderIndex = menuSkills.length;
for (let i = 0; i < menuSkills.length; i++)//ADD LOGIC FOR MORE OPTIONS THAN 5 : maxOptions
{
    //Allows for code to get called before the menu generates, useful for dynamically set groups or dropdowns
    if (menuSkills[i].tags[menuType + "OnBeforeCreate"]) {
        await whisper(menuSkills[i], menuType + "OnBeforeCreate");
    }

    if (menuSkills[i].tags[menuType + "Hide"]) {
        continue;
    }

    const currentSkill = menuSkills[i];

    const abMenuButton = {
        ...BASE_TAGS,
        baseSkill: "🔗" + currentSkill.id,
        label: currentSkill.tags[menuType + "Label"],
        formAddress: currentSkill.tags[menuType + "Icon"],
        onCreate: currentSkill.tags[menuType + "OnGenerate"],
        abMenuSortOrder: currentSkill.tags[menuType + "SortOrder"],
        color: currentSkill.tags[menuType + "Color"] ?? links.personality.tags.abBaseMenuColor,
    };

    const clickSound = currentSkill.tags[menuType + 'ClickSound'];
    if (clickSound) {
        abMenuButton.soundClick = clickSound;
    }

    const menuItemType = currentSkill.tags[menuType + "ItemType"];

    if (menuItemType == "dropdown") {
        abMenuButton.dropdownOptions = currentSkill.tags.dropdownOptions;

        const prevDropdown = links.remember.links.lastOpenedDropdown;
        if (prevDropdown && prevDropdown.tags[menuType + "Action"]) {
            if (prevDropdown == currentSkill) {
                setTagMask(links.remember, "lastOpenedDropdown", null);
                abMenuButton.defaultOpen = true;
            }
        } else {
            if (currentSkill.tags[menuType + "DefaultOpen"] == true) {
                abMenuButton.defaultOpen = true;
            }
        }

        if (currentSkill.tags.dropdownSortOrder == "auto") {
            abMenuButton.dropdownSortOrder = sortOrderIndex;
            ++sortOrderIndex;
        } else {
            abMenuButton.dropdownSortOrder = currentSkill.tags.dropdownSortOrder;
        }
        await thisBot.abCreateMenuDropdown(abMenuButton);
    } else if (menuItemType == "group") {
         if (currentSkill.tags.groupSortOrder == "auto") {
            abMenuButton.groupSortOrder = sortOrderIndex;
            ++sortOrderIndex;
        } else {
            abMenuButton.groupSortOrder = currentSkill.tags.groupSortOrder;
        }
        abMenuButton.menuItems = currentSkill.tags.menuItems;
        thisBot.abCreateMenuGroup(abMenuButton);
    } else if (menuItemType == "input") {
        abMenuButton.onSubmit = `@
            links.baseSkill.onSubmit(that);
        `
        thisBot.abCreateMenuInput(abMenuButton);
    } else if (menuItemType == "text") {
        thisBot.abCreateMenuText(abMenuButton);
    } else if (menuItemType == "tool") {
        thisBot.abCreateMenuTool(abMenuButton);
    } else if (menuItemType == "wizard") {
        thisBot.abCreateMenuWizard(abMenuButton);
    } else {
        thisBot.abCreateMenuButton(abMenuButton);
    }
}

thisBot.masks.onGridClick = `@
    shout('abMenuRefresh');
    links.manifestation.abClick({ reset: true });
`;
thisBot.masks.onKeyDown = `@
    if (that.keys.includes('Escape')) {
        shout('abMenuRefresh');
        links.manifestation.abClick({ reset: true });
    }
`;

shout('onABOpenMenu', { menu: that, menuType, menuPortal: configBot.masks.menuPortal });
