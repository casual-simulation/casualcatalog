const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const chatStreaming = {
    ...menuOptions,
    label: "chat streaming",
    ask: getLink(ab.links.ask),
    onCreate: ListenerString(() => {
        links.ask.vars.onBotChanged = (that) => {
            if (that.tags.includes('abChatStreaming')) {
                thisBot.refreshDisplay();
            }
        }

        os.addBotListener(links.ask, 'onBotChanged', links.ask.vars.onBotChanged);

        thisBot.refreshDisplay();
    }),
    refreshDisplay: ListenerString(() => {
        links.ask.tags.abChatStreaming ? tags.formAddress = 'check_box' : tags.formAddress = 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        setTagMask(links.ask, 'abChatStreaming', !!!links.ask.tags.abChatStreaming, 'shared');
    }),
    onDestroy: ListenerString(() => {
        os.removeBotListener(links.ask, 'onBotChanged', links.ask.vars.onBotChanged);
    })
};

const clearHistory = {
    ...menuOptions,
    label: `clear ${ab.links.personality.tags.abBuilderIdentity} ai chat history`,
    formAddress: 'clear_all',
    onCreate: ListenerString(() => {
        const history = ab.links.ask.abConversationHistoryGet({ historyStorageBot: ab.links.remember }) ?? [];
        const percentFilled = Math.round((history.length / ab.links.ask.tags.maxHistoryMessages) * 100);
        tags.label = `clear ${ab.links.personality.tags.abBuilderIdentity} ai chat history (${percentFilled}% full)`;
    }),
    onClick: ListenerString(() => {
        ab.links.ask.abConversationHistoryClear({ historyStorageBot: ab.links.remember });
        shout('abMenuRefresh');
    }),
};

dropdownOptions.push(chatStreaming);
dropdownOptions.push(clearHistory);

masks.dropdownOptions = dropdownOptions;