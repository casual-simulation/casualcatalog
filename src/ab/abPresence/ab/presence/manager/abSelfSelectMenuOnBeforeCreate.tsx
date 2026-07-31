const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const camPresence = {
    ...menuOptions,
    label: "camera presence",
    presence: tags.presence,
    onCreate: ListenerString(() => {
        thisBot.vars.onPresenceBotChanged = (that) => {
            if (that.tags.includes('cameraEnabled')) {
                thisBot.refreshDisplay();
            }
        }

        os.addBotListener(ab.links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);

        thisBot.refreshDisplay();
    }),
    refreshDisplay: ListenerString(() => {
        ab.links.presence.tags.cameraEnabled ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        setTagMask(ab.links.presence, 'cameraEnabled', !!!ab.links.presence.tags.cameraEnabled, 'local');
    }),
    onDestroy: ListenerString(() => {
        os.removeBotListener(ab.links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);
    })
}

const cursorPresence = {
    ...menuOptions,
    label: "cursor presence",
    presence: tags.presence,
    onCreate: ListenerString(() => {
        thisBot.vars.onPresenceBotChanged = (that) => {
            if (that.tags.includes('cursorEnabled')) {
                thisBot.refreshDisplay();
            }
        }

        os.addBotListener(ab.links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);

        thisBot.refreshDisplay();
    }),
    refreshDisplay: ListenerString(() => {
        ab.links.presence.tags.cursorEnabled ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        setTagMask(ab.links.presence, 'cursorEnabled', !!!ab.links.presence.tags.cursorEnabled, 'local');
    }),
    onDestroy: ListenerString(() => {
        os.removeBotListener(ab.links.presence, 'onBotChanged', thisBot.vars.onPresenceBotChanged);
    })
}

dropdownOptions.push(camPresence);
dropdownOptions.push(cursorPresence);

masks.dropdownOptions = dropdownOptions;