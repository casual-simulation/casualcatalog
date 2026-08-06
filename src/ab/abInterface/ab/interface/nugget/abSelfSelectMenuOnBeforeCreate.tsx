const dropdownOptions = [];

const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const nuggets = {
    ...menuOptions,
    label: "nuggets",
    onCreate: ListenerString(() => {
        tags.nugManager = getLink(getBot('system', 'ab.interface.nugget')); 
        
        if (links.nugManager.tags.listening) { 
            tags.onClick = ListenerString(() => {
                shout('abMenuRefresh'); 
                ab.links.manifestation.abClick();
                setTagMask(links.nugManager, 'listening', null);
            });
            tags.formAddress = `check_box`; 
        } else { 
            tags.onClick = ListenerString(() => {
                shout('abMenuRefresh'); 
                ab.links.manifestation.abClick();
                setTagMask(links.nugManager, 'listening', true, 'local');
            });
            tags.formAddress = `check_box_outline_blank`;
        }
    })
}

dropdownOptions.push(nuggets);

masks.dropdownOptions = dropdownOptions;