const menuItems = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);



const defaultABKit = {
    ...menuOptions,
    label: `${abRemember.tags.defaultABKitName ?? 'build kit'}`,
    formAddress: "category",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: abRemember.tags.defaultABKit ?? 'casual_kit_loader'})
    }),  
}

if (tags.currentKit == abRemember.tags.defaultABKit) {
} 

else {
    menuItems.push(defaultABKit);
}

masks.menuItems = menuItems;