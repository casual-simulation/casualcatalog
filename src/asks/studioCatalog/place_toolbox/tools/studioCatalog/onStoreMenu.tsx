let possiblePublishBot = new Set();

const multiSelect = Array.isArray(thisBot.links.selectedBots);

if (thisBot.links.selectedBots) {
    if (multiSelect) {
        thisBot.links.selectedBots.forEach(b => possiblePublishBot.add(b));
    } else {
        possiblePublishBot.add(thisBot.links.selectedBots);
    }
}

possiblePublishBot = Array.from(possiblePublishBot);

const baseAB = (multiSelect || !thisBot.links.selectedBots) ? ab.links.remember.tags.baseAB: thisBot.links.selectedBots.id;
const baseBots = getBots(b => b.tags.abIDOrigin === baseAB && b.space === 'shared' && !b.tags.abIgnore);
const nonABBots = getBots(b => b.tags.abIDOrigin == null && b.space === 'shared' && !b.tags.abIgnore);

shout("clearStudioCalatogPublishMenu");
shout("abMenuRefresh");

configBot.masks.menuPortal = "studioCalatogPublishMenu";

const defaults = {
    studioCalatogPublishMenu: true,
    clearStudioCalatogPublishMenu: "@ destroy(thisBot);",
    abMenuRefresh: `@destroy(thisBot);`,
    manager: getLink(ab.links.store),
    remember: ab.tags.remember,
    catalog: getLink(thisBot),
    menuItemStyle: `🧬 {
        "border-radius": "0px", 
        "margin-top": "0px",
        "border-width": "2px", 
        "border-left-style": "solid",
        "border-right-style": "solid",
        "border-color": "${abPersonality.tags.abBaseShadowColor}",
        "box-shadow": "3px 4px ${abPersonality.tags.abBaseShadowColor}",
        "min-height": "44px"
    }`
}

// Create download button
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenuSortOrder: 9,
    label: "download",
    menuItemStyle: `🧬 {
        "border-radius": "8px", 
        "margin-top": "8px",         
        "border-width": "2px", 
        "border-style": "solid",
        "border-color": "${abPersonality.tags.abBaseShadowColor}",
        "box-shadow": "3px 4px ${abPersonality.tags.abBaseShadowColor}",
        "min-height": "44px"
    }`,
    formAddress: "get_app",
    possibleBot: getLink(possiblePublishBot),
    onClick: `@ links.manager.abDownload({ possibleBots: links.possibleBot, sourceEvent: 'ab_store_menu_download' });`
});

if (!authBot) 
{
    // Create login message
    ab.links.menu.abCreateMenuButton({
        ...defaults,
        studioCalatogPublishMenuSortOrder: 9,
        label: "please sign in to access share features",
        formAddress: "lock",
        onClick: `@ os.requestAuthBot()`
    });

    return;
}
else if (authBot.tags.subscriptionTier == "FreePlay") 
{
    // Create upgrade subscription button
    ab.links.menu.abCreateMenuButton({
        ...defaults,
        label: "please upgrade your subscription to access share features",
        formAddress: "lock"
    });

    return;
}

const totalBotCount = possiblePublishBot.length > 0 ? possiblePublishBot.length : baseBots.length + nonABBots.length;

// Create publish label button
const labelBot = await ab.links.menu.abCreateMenuButton({
    ...defaults,
    label: `publish pattern ${baseBots.length > 0 ? "" : "as "}${baseAB} (${totalBotCount} bot${baseBots.length + nonABBots.length == 1 ? "" : "s"})`,
    totalBots: baseBots.length + nonABBots.length,
    studioCalatogPublishMenuSortOrder: 1,
    labelAlignment: "center",
    formAddress: null,
    menuItemStyle: `🧬 {
        "border-radius": "8px 8px 0px 0px", 
        "margin-top": "8px",         
        "border-width": "2px", 
        "border-top-style": "solid",
        "border-left-style": "solid",
        "border-right-style": "solid",
        "border-color": "${abPersonality.tags.abBaseShadowColor}",
        "box-shadow": "3px 4px ${abPersonality.tags.abBaseShadowColor}",
        "min-height": "44px"
    }`,
    shiftState: false,
    onClick: `@ const menuBots = getBots('studioCalatogPublishMenuSortOrder');

        if (tags.shiftState)
        {
            whisper(menuBots, "onKeyUp", {keys: ["Shift"]});
        }
        else
        {
            whisper(menuBots, "onKeyDown", {keys: ["Shift"]});
        }
        
        tags.shiftState = !tags.shiftState;`,
    scaleY: "auto",
    abSelectTitleUpdate: `@ let totalBots = configBot.tags.abExcludeUnclaimed ? that.abBots : that.abBots + that.nonABBots;

    const totalBotVar = totalBots == 1 ? " bot" : " bots";
    const botVar = that.nonABBots?.length  == 1 ? " bot)" : " bots)";

    if (that.ab == "new pattern")
    {
        links.remember.masks.baseAB = null;

        if (getBot("abIDOrigin", links.remember.tags.baseAB))
        {
            const abBots = getBots(b => b.tags.abIDOrigin === links.remember.tags.baseAB && b.space === 'shared' && !b.tags.abIgnore).length;

            tags.label = "publish " + links.remember.tags.baseAB + " (" + abBots + " bots)";
            tags.totalBots = abBots;
        }
        else
        {
            tags.label = "publish pattern as " + links.remember.tags.baseAB + " (" + totalBots + totalBotVar + ")";
            tags.totalBots = totalBots;
        }   
    }
    else
    {   
        tags.label = "publish " + that.ab + " (" + totalBots + totalBotVar + ")";
        tags.totalBots = totalBots;
    }`
});

// Create encrypt button
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenu: null,
    studioCalatogPublishMenuSortOrder: 2,
    dimension: "studioCalatogPublishMenu",
    label: "encrypt",
    formAddress: "check_box_outline_blank",
    encryptState: false,
    onKeyDown: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = true;
            }`,
    onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
    onClick: `@ if(tags.encryptState)
        {
            tags.encryptState = false;
            tags.formAddress = 'check_box_outline_blank';
            configBot.tags.encryption = null;
        }
        else
        {
            tags.encryptState = true;
            tags.formAddress = 'check_box';
            configBot.tags.encryption = true;
        }`,
});

let abButton;

if (possiblePublishBot?.length < 1)
{
    // Create includeBots button
    abButton = await ab.links.menu.abCreateMenuButton({
        ...defaults,
        studioCalatogPublishMenu: null,
        dimension: 'studioCalatogPublishMenu',
        studioCalatogPublishMenuSortOrder: 1.52,
        abSelectionButton: true,
        label: baseBots.length > 0 && baseAB != undefined ? `selected pattern: ${baseAB} (${baseBots.length} bot${baseBots.length == 1 ? "" : "s"})` : `new pattern (${nonABBots.length} bot${nonABBots.length == 1 ? "" : "s"})`,
        formAddress: 'egg',
        onKeyDown: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = true;
            }`,
        onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
        onClick: `@ links.catalog.patternSelectMenu();`,
        abSelectTitleUpdate: `@ const botVarNon = that.nonABBots  == 1 ? " bot)" : " bots)";
        const botVarAB = that.abBots  == 1 ? " bot)" : " bots)";

        if (that.ab == "new pattern")
        {
            tags.label = that.ab + " (" + that.nonABBots + botVarNon;
        }
        else
        {
            tags.label = "selected pattern: " + that.ab + " (" + that.abBots + botVarAB;
        }`
    });
}

if (nonABBots.length > 0 && possiblePublishBot?.length < 1)
{
    //iclude new bots
    ab.links.menu.abCreateMenuButton({
        ...defaults,
        studioCalatogPublishMenu: null,
        studioCalatogPublishMenuSortOrder: 1.53,
        abButton: getLink(abButton),
        labelBot: getLink(labelBot),
        dimension: "studioCalatogPublishMenu",
        label: `include new (${nonABBots.length} bot${nonABBots.length == 1 ? "" : "s"})`,
        formAddress: "check_box",
        unclaimedState: false,
        onKeyDown: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = true;

                const labelCheck = links.abButton.tags.label;

                if (labelCheck.includes('new pattern'))
                {
                    masks[tags.dimension] = false;
                }
                else
                {
                    masks[tags.dimension] = null;
                }
            }`,
        onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
        onClick: `@ const abBots = getBots(b => b.tags.abIDOrigin === links.remember.tags.baseAB && b.space === 'shared' && !b.tags.abIgnore);
            
            if(tags.unclaimedState)
            {
                const nonABBots = getBots(b => b.tags.abIDOrigin == null && b.space === 'shared' && !b.tags.abIgnore);

                tags.unclaimedState = false;
                tags.formAddress = 'check_box';
                configBot.tags.abExcludeUnclaimed = null;

                links.labelBot.abSelectTitleUpdate({ab: links.remember.tags.baseAB, abBots: abBots.length, nonABBots: nonABBots.length});
            }
            else
            {
                tags.unclaimedState = true;
                tags.formAddress = 'check_box_outline_blank';

                configBot.tags.abExcludeUnclaimed = true;

                links.labelBot.abSelectTitleUpdate({ab: links.remember.tags.baseAB, abBots: abBots.length, nonABBots: 0});
            }`,
        abSelectTitleUpdate: `@ const botVar = that.nonABBots == 1 ? " bot)" : " bots)";
        
            tags.label = "include new (" + that.nonABBots + botVar;

            const labelCheck = that.ab;

            if(!labelCheck.includes('new pattern'))
            {
                masks[tags.dimension] = null;
            }
            else
            {
                masks[tags.dimension] = false;
            }`
    });
}

// Create public button
if (authBot.tags.privacyFeatures.allowPublicData) 
{
    configBot.tags.publicFacing = false;

    ab.links.menu.abCreateMenuButton({
        ...defaults,
        studioCalatogPublishMenuSortOrder: 2,
        label: "isPublic",
        formAddress: "check_box_outline_blank",
        publicState: false,
        onClick: `@ if(tags.publicState)
            {
                tags.publicState = false;
                tags.formAddress = 'check_box_outline_blank';
                configBot.tags.publicFacing = null;
            }
            else
            {
                tags.publicState = true;
                tags.formAddress = 'check_box';
                configBot.tags.publicFacing = true;
            }`
    });
}


//HERE

// Create version select button
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenu: null,
    dimension: 'studioCalatogPublishMenu',
    studioCalatogPublishMenuSortOrder: 1.51,
    label: 'versionFlag=current',
    formAddress: 'alt_route',
    showVersionSelector: `@ tags[tags.dimension] = null;`,
    hideVersionSelector: `@ tags[tags.dimension] = true;`,
    onKeyDown: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = true;
            }`,
    onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
    onClick: `@ shout('showVersionSelector');`,
    versionOptionClick: `@
            tags.label = 'versionFlag=' + that;
            tags[tags.dimension] = true;
        `,
});

// Current Version
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenu: null,
    label: 'current',
    dimension: 'studioCalatogPublishMenu',
    studioCalatogPublishMenuSortOrder: 1.51,
    formAddress: 'radio_button_checked',
    showVersionSelector: `@ tags[tags.dimension] = true;`,
    hideVersionSelector: `@ tags[tags.dimension] = null;`,
    onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
    onClick: `@
            tags.formAddress = 'radio_button_checked';
            configBot.tags.versionDefined = null;
            shout('versionOptionClick', tags.label);
            tags[tags.dimension] = null;
        `,
    versionOptionClick: `@ if (that == tags.label) { return; }
            tags.formAddress = 'radio_button_unchecked';
            tags[tags.dimension] = null;
        `
});

// Feedback Version
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenu: null,
    label: 'feedback',
    dimension: 'studioCalatogPublishMenu',
    studioCalatogPublishMenuSortOrder: 1.511,
    formAddress: 'radio_button_unchecked',
    showVersionSelector: `@ tags[tags.dimension] = true;`,
    hideVersionSelector: `@ tags[tags.dimension] = null;`,
    onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
    onClick: `@
            tags.formAddress = 'radio_button_checked';
            configBot.tags.versionDefined = 'feedback';
            shout('versionOptionClick', tags.label);
            tags[tags.dimension] = null;
        `,
    versionOptionClick: `@ if (that == tags.label) { return; }
            tags.formAddress = 'radio_button_unchecked';
            tags[tags.dimension] = null;
        `
});

// Stable Version
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenu: null,
    label: 'stable',
    dimension: 'studioCalatogPublishMenu',
    studioCalatogPublishMenuSortOrder: 1.512,
    formAddress: 'radio_button_unchecked',
    showVersionSelector: `@ tags[tags.dimension] = true;`,
    hideVersionSelector: `@ tags[tags.dimension] = null;`,
    onKeyUp: `@ if (that.keys[0] == "Shift")
            {
                tags[tags.dimension] = false;
            }`,
    onClick: `@
            tags.formAddress = 'radio_button_checked';
            configBot.tags.versionDefined = 'stable';
            shout('versionOptionClick', tags.label);
            tags[tags.dimension] = null;
        `,
    versionOptionClick: `@ if (that == tags.label) { return; }
            tags.formAddress = 'radio_button_unchecked';
            tags[tags.dimension] = null;
        `
});

// Create publish button
ab.links.menu.abCreateMenuButton({
    ...defaults,
    studioCalatogPublishMenuSortOrder: 4,
    formAddress: "egg",
    menuItemStyle: `🧬 {
        "border-radius": "0px 0px 8px 8px",
        "margin-top": "0px",
        "border-width": "2px",
        "border-left-style": "solid",
        "border-right-style": "solid",
        "border-bottom-style": "solid",
        "border-color": "${abPersonality.tags.abBaseShadowColor}",
        "box-shadow": "3px 4px ${abPersonality.tags.abBaseShadowColor}",
        "min-height": "44px"
    }`,
    form: "input",
    labelBot: getLink(labelBot),
    onInputTyping: `@ links.labelBot.tags.label = 'publish pattern as ' + that.text + ' (' + links.labelBot.tags.totalBots + ' bot' + (links.labelBot.tags.totalBots == 1 ? ')' : 's)');`,
    menuItemShowSubmitWhenEmpty: true,
    targetBot: getLink(possiblePublishBot),
    selected_studio_id: tags.studioId,
    menuItemText: baseAB,
    onSubmit: `@
            if (that.text == null && links.remember.tags.baseAB && !links.remember.links.abBotFocus)
            {
                that.text = links.remember.tags.baseAB;
            }

            let confirmPush = false;
            let inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

            if (inXR) {
                confirmPush = true;
            } else {
                const targetStudio = tags.selected_studio_id ?? authBot.id;
                confirmPush = await os.showConfirm({
                    title: "confirm publish",
                    content: "publish " + that.text + " to " + targetStudio + "?",
                    confirmText: "publish",
                    cancelText: "cancel"
                });
                configBot.tags.selected_studioID = targetStudio;
            }

            if (!confirmPush)
            {
                return;
            }

            if (that.text)
            {
                links.manager.abPublishAB({ ab: that.text, bot: links.targetBot, baseAB: links.remember.tags.baseAB, manualPublish: true, sourceEvent: 'store_menu' });
            }
            else
            {
                os.toast("ab not specified");
            }
        `,
    abSelectTitleUpdate: `@ 
    if (that.ab == "new pattern")
    {
        links.remember.masks.baseAB = null;

        tags.menuItemText = links.remember.tags.baseAB;
    }
    else
    {
        tags.menuItemText = that.ab;
    }`
});

if (!multiSelect && tags.selectedBots) 
{
    // Create copy to clipboard button
    ab.links.menu.abCreateMenuButton({
        ...defaults,
        studioCalatogPublishMenuSortOrder: 8,
        menuItemStyle: `🧬 {
            "border-radius": "8px", 
            "margin-top": "8px",
            "border-width": "2px", 
            "border-style": "solid",
            "border-color": "${abPersonality.tags.abBaseShadowColor}",
            "box-shadow": "3px 4px ${abPersonality.tags.abBaseShadowColor}",
            "min-height": "44px"
        }`,
        label: "copy to clipboard",
        formAddress: "file_copy",
        targetBot: getLink(tags.selectedBots),
        onClick: `@ 
            const selectedBot = links.targetBot;

            ab.links.paste.abCopyBotsToClipboard({ bots: [links.targetBot], sourceEvent: 'ab_store_menu_copy_clipboard' })

            shout("abMenuRefresh");
        `,
    });
}
else 
{
    // Create scan button
    ab.links.menu.abCreateMenuButton({
        ...defaults,
        studioCalatogPublishMenuSortOrder: 10,
        menuItemStyle: `🧬 {            
            "border-radius": "8px", 
            "margin-top": "8px",
            "border-width": "2px", 
            "border-style": "solid",
            "border-color": "${abPersonality.tags.abBaseShadowColor}",
            "box-shadow": "3px 4px ${abPersonality.tags.abBaseShadowColor}",
            "min-height": "44px"
        }`,
        label: "scan to publish",
        formAddress: "qr_code_scanner",
        onClick: `@ configBot.tags.publishScan = true; os.openQRCodeScanner();`,
    });
}