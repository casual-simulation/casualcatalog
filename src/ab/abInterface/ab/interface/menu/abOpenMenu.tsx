await os.requestAuthBotInBackground();

configBot.masks.menuPortal = "abMenu";

const chosenMenu = that.menu ?? that;

let menuType = chosenMenu ? "ab" + chosenMenu.charAt(0).toUpperCase() + chosenMenu.slice(1) + "Menu": "abCoreMenu"; //set up a check to see what type of menu should be occuring [core, bot, grid, inst]
let kitMenuType = chosenMenu ? "ab" + (that.ignoreABKit ? '' : ab.links.manifestation.tags.currentKit ? ab.links.manifestation.tags.currentKit.charAt(0).toUpperCase() +  ab.links.manifestation.tags.currentKit.slice(1) : '') + chosenMenu.charAt(0).toUpperCase() + chosenMenu.slice(1) + "Menu": "abCoreMenu";
let menuSkills = getBots(menuType + "Action");
if (ab.links.manifestation.tags.currentKit) {
    const kitMenuSkills = getBots(kitMenuType + 'Action');
    const uniqueCombined = [
        ...new Map([...menuSkills, ...kitMenuSkills].map(item => [item.id, item])).values()
    ];
    menuSkills = uniqueCombined;
}
let maxOptions = menuType == "inst" ? 7 : 5;

console.log("menuType", menuType)

const BASE_TAGS = {
    abMenu: true,
    remember: tags.remember,
    personality: tags.personality,
    manifestation: tags.manifestation,
    abMenuRefresh: "@ destroy(thisBot);",
};

let sortOrderIndex = menuSkills.length;
for (let i = 0; i < menuSkills.length; i++)//ADD LOGIC FOR MORE OPTIONS THAN 5 : maxOptions
{
    const currentSkill = menuSkills[i];
    let menuTagString = menuType;
    if (!currentSkill?.tags[menuType + "Action"] && currentSkill?.tags[kitMenuType + "Action"]) {
        menuTagString = kitMenuType;
    }

    //Allows for code to get called before the menu generates, useful for dynamically set groups or dropdowns
    if (menuSkills[i].tags[menuTagString + "OnBeforeCreate"]) {
        await whisper(menuSkills[i], menuTagString + "OnBeforeCreate");
    }

    if (menuSkills[i].tags[menuTagString + "Hide"]) {
        continue;
    }

    const abMenuButton = {
        ...BASE_TAGS,
        baseSkill: "🔗" + currentSkill.id,
        label: currentSkill.tags[menuTagString + "Label"],
        formAddress: currentSkill.tags[menuTagString + "Icon"],
        onCreate: currentSkill.tags[menuTagString + "OnGenerate"],
        abMenuSortOrder: currentSkill.tags[menuTagString + "SortOrder"],
        color: currentSkill.tags[menuTagString + "Color"] ?? links.personality.tags.abBaseMenuColor,
    };

    if (currentSkill?.tags[menuTagString + "Action"]) {
        abMenuButton.onClick = `@ links.baseSkill.${menuTagString + "Action"}({bot: thisBot});`
    }

    let clickSound = currentSkill.tags[menuTagString + 'ClickSound'];
    if (clickSound) {
        abMenuButton.soundClick = clickSound;
    }

    const menuItemType = currentSkill.tags[menuTagString + "ItemType"];

    if (menuItemType == "dropdown") {
        abMenuButton.dropdownOptions = currentSkill.tags.dropdownOptions;

        const prevDropdown = links.remember.links.lastOpenedDropdown;
        if (prevDropdown && prevDropdown.tags[menuTagString + "Action"]) {
            if (prevDropdown == currentSkill) {
                setTagMask(links.remember, "lastOpenedDropdown", null);
                abMenuButton.defaultOpen = true;
            }
        } else {
            if (currentSkill.tags[menuTagString + "DefaultOpen"] == true) {
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

shout('onABOpenMenu', { menu: chosenMenu, menuType, menuPortal: configBot.masks.menuPortal });
