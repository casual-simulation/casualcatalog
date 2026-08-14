const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const voiceEnabled = {
    ...menuOptions,
    label: "voice enabled",
    voice: getLink(thisBot),
    onCreate: ListenerString(() => {
        thisBot.vars.onVoiceBotChanged = (that) => {
            if (that.tags.includes('voiceEnabled')) {
                thisBot.refreshDisplay();
            }
        }

        os.addBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);

        thisBot.refreshDisplay();
    }),
    refreshDisplay: ListenerString(() => {
        links.voice.tags.voiceEnabled ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        setTagMask(links.voice, 'voiceEnabled', !!!links.voice.tags.voiceEnabled, 'tempLocal');
    }),
    onDestroy: ListenerString(() => {
        os.removeBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);
    })
};

const autoSpeak = {
    ...menuOptions,
    label: "auto speaks",
    voice: getLink(thisBot),
    onCreate: ListenerString(() => {
        thisBot.vars.onVoiceBotChanged = (that) => {
            if (that.tags.includes('autoSpeak') || that.tags.includes('voiceEnabled')) {
                thisBot.refreshDisplay();
            }
        }

        os.addBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);

        thisBot.refreshDisplay();
    }),
    refreshDisplay: ListenerString(() => {
        tags.abMenu = links.voice.tags.voiceEnabled;
        links.voice.tags.autoSpeak ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        setTagMask(links.voice, 'autoSpeak', !!!links.voice.tags.autoSpeak, 'tempLocal');
    }),
    onDestroy: ListenerString(() => {
        os.removeBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);
    })
};

const micMute = {
    ...menuOptions,
    label: "mic muted",
    voice: getLink(thisBot),
    onCreate: ListenerString(() => {
        thisBot.vars.onVoiceBotChanged = (that) => {
            if (that.tags.includes('muted') || that.tags.includes('voiceEnabled')) {
                thisBot.refreshDisplay();
            }
        }

        os.addBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);

        thisBot.refreshDisplay();
    }),
    refreshDisplay: ListenerString(() => {
        tags.abMenu = links.voice.tags.voiceEnabled;
        links.voice.tags.muted ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        setTagMask(links.voice, 'muted', !!!links.voice.tags.muted, 'tempLocal');
    }),
    onDestroy: ListenerString(() => {
        os.removeBotListener(links.voice, 'onBotChanged', thisBot.vars.onVoiceBotChanged);
    })
};

dropdownOptions.push(voiceEnabled);
dropdownOptions.push(autoSpeak);
dropdownOptions.push(micMute);

masks.dropdownOptions = dropdownOptions;