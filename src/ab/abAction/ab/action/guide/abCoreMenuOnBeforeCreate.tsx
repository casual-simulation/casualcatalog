const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

if (!tags.abGuideEnabled) {
    masks.abCoreMenuHide = true;
} else {
    masks.abCoreMenuHide = null;
}

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

const defaultMenu = {
    options: [
    'I want to rest',
    'I want to play',
    'I want to work',
    'none of the above'
]}

let menuArr;
if (tags.menuData && tags.menuData.options && tags.menuData.options.length > 0) {
    menuArr =  tags.menuData.options;
} else {
    menuArr = defaultMenu.options;
}


for(let i = 0; i < menuArr.length; ++i) {
    let newMenuItem = {
        ...menuOptions,
        content: menuArr[i],
        label: (menuArr.length - i - 1) + '. '  + menuArr[i] + '...',
        formAddress: 'radio_button_unchecked',
        onClick: `@
            shout("resetGuideOptionsSelectionState");
            await os.sleep(0);
            tags.formAddress = 'radio_button_checked';
            
            links.skillBot.setText(tags.label);
        `,
        resetGuideOptionsSelectionState: `@
            if (tags.formAddress != 'radio_button_unchecked') {
                tags.formAddress = 'radio_button_unchecked';
            } 
        `
    }
    dropdownOptions.push(newMenuItem);
}

// const inputButton = {
//     ...menuOptions,
//     menuItemType: "input",
//     abGuideInputBox: true,
//     onInputTyping: `@
//         shout("resetGuideOptionsSelectionState");
//     `,
//     onSubmit: `@
//         links.skillBot.submitAIRequest(that.text);
//     `
// }

// dropdownOptions.push(inputButton)

masks.dropdownOptions = dropdownOptions;