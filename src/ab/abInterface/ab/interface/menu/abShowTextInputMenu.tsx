const {
    title,
    placeholder,
    currentValue,
    onSubmitCallback,
} = that ?? {};

// Open a sub-portal with a title card, input field, and back button to edit
// the text tag (mirrors the configurator text-property pattern).
const textMenuPortal = 'abTextInputMenu';
const clearEvent = 'clearAbTextInputMenu';
const returnPortal = configBot.tags.menuPortal;

configBot.masks.menuPortal = textMenuPortal;

// Tags shared by every bot in the sub-portal: the portal dimension, the return
// portal, and the three cleanup paths (clearEvent, menu refresh, ab bot click).
const BASE_MENU_BOT = {
    space: 'tempLocal',
    textMenuPortal,
    [textMenuPortal]: true,
    clearEvent,
    returnPortal,
    [clearEvent]: ListenerString(() => { destroy(thisBot); }),
    abMenuRefresh: ListenerString(() => { destroy(thisBot); }),
    onABClick: ListenerString(() => {
        if (configBot.tags.menuPortal !== tags.textMenuPortal) destroy(thisBot);
    }),
};

// Title card
ab.links.menu.abCreateMenuText({
    ...BASE_MENU_BOT,
    [textMenuPortal + 'SortOrder']: Number.MIN_SAFE_INTEGER,
    label: title,
    labelAlignment: 'center',
    menuItemStyle: {},
    menuItemLabelStyle: { 'font-weight': 'bold' },
});

// Input field
const inputBot = ab.links.menu.abCreateMenuInput({
    ...BASE_MENU_BOT,
    [textMenuPortal + 'SortOrder']: 1,
    formInputMultiline: true,
    menuItemShowSubmitWhenEmpty: true,
    label: placeholder,
    menuItemText: currentValue ?? '',
    onCreate: ListenerString(() => {
        thisBot.refreshDisplay();
    }),
    onBotChanged: ListenerString(() => {
        if (that.tags.includes('menuItemText')) {
            thisBot.refreshDisplay();
        }
    }),
    refreshDisplay: ListenerString(() => {
        // masks.labelColor = tags.menuItemText != null ? null : 'red';
    }),
    onSubmit: ListenerString(() => {
        shout(tags.clearEvent);
        configBot.masks.menuPortal = tags.returnPortal;
    }),
});

os.addBotListener(inputBot, 'onSubmit', onSubmitCallback);

// Back button
ab.links.menu.abCreateMenuButton({
    ...BASE_MENU_BOT,
    [textMenuPortal + 'SortOrder']: Number.MAX_SAFE_INTEGER,
    label: 'back',
    formAddress: 'arrow_back',
    onClick: ListenerString(() => {
        shout(tags.clearEvent);
        configBot.masks.menuPortal = tags.returnPortal;
    }),
});

