const inquiry = that?.message ?? that;
const initialBoot = that?.initialBoot ?? false;
const autoHatch = that?.autoHatch ?? false;
const menu = that?.menu ?? "core";
const inquiryHasSpace = inquiry.indexOf(" ") !== -1;
const menuBots = getBots(configBot.tags.menuPortal, true);
const isChannel = that.isChannel ?? false;
const isUUAB = that.isUUAB ?? false;
const agentMode = that.agentMode ?? 'plan';

whisper(menuBots, "abMenuRefresh");

let username = "user";
if (authBot && authBot.tags.name) {
    username = authBot.tags.name;
} else if (ab.links.console.masks.preferredName) {
    username = ab.links.console.masks.preferredName;
}

ab.log({ message: inquiry, name: username });

if (!configBot.tags.tagPortal && ab.links.manifestation.tags.abAwake && inquiry != ".log") {
    shout("showConsole");
}

if (isUUAB) {
    links.uuabLoader?.loadUUAB(inquiry);
}
else if (isChannel) {
    links.channelLoader?.loadChannel(inquiry);
}
else if (!inquiryHasSpace) {
    const isDirectSearch = inquiry.startsWith(`"`) && inquiry.endsWith(`"`);

    const eggParameters = {};
    if (that.dimension) {
        eggParameters.gridInformation = {
            dimension: that.dimension,
            position: { x: that.dimensionX ?? 0, y: that.dimensionY ?? 0 }
        }
    }

    const ask: ABLookupAskIDResult | false = !isDirectSearch ? await ab.links.search.onLookupAskID({ askID: inquiry, autoHatch: true, eggParameters, sourceEvent: 'ask' }) : false;

    if (ask?.success && ask?.data?.url != undefined && !isDirectSearch && !isChannel) {
        ab.abJoinHost({ data: ask.data });
    } else if (!ask?.success) {
        let egg: ABLookupEggResult;
        const periodIndex = inquiry.indexOf(".");
        let abID = inquiry;

        if (isDirectSearch) {
            abID = inquiry.substring(1, inquiry.length - 1);
        }

        if (periodIndex == -1 || isDirectSearch) {
            egg = await ab.links.search.onLookupABEggs({ abID: abID, initialBoot, autoHatch, eggParameters, sourceEvent: 'ask' });
        } else if (periodIndex > 0) {
            const recordKey = inquiry.substring(0, periodIndex);

            abID = inquiry.substring(periodIndex + 1);

            egg = await ab.links.search.onLookupABEggs({ recordKey: recordKey, abID: abID, initialBoot, autoHatch, eggParameters, sourceEvent: 'ask', });
        } else {
            ab.links.input.onChat({ message: inquiry });
        }

        if (!egg?.success && ab.links.menu) {
            configBot.masks.menuPortal = "abMenu";

            const studioButton = {};

            studioButton.abMenu = true;
            studioButton.label = abID + " not found in active studio, enter alternate studioID";
            studioButton.form = "input";
            studioButton.abID = abID;
            studioButton.formAddress = tags.abCoreMenuIcon;
            studioButton.manager = getLink(thisBot);
            studioButton.abMenuRefresh = "@ destroy(thisBot);";
            studioButton.onSubmit = ListenerString(() => {
                links.manager.abCoreMenuAction(that.text + "." + tags.abID);
            });

            const createButton = {};

            createButton.abMenu = true;
            createButton.label = "give me a prototype";
            createButton.manager = getLink(thisBot);
            createButton.abMenuRefresh = "@ destroy(thisBot);";
            createButton.abID = abID;
            createButton.onClick = ListenerString(() => {
                links.manager.abCoreMenuAction("Make me: " + tags.abID);
            });

            ab.links.menu.abCreateMenuButton(createButton);
            ab.links.menu.abCreateMenuButton(studioButton);

            thisBot.masks.onGridClick = ListenerString(() => {
                shout('abMenuRefresh');
            });
        }
    }
} else {
    await os.requestAuthBot();

    if (!authBot) {
        os.toast("please sign in to access advanced AI features");

        ab.links.manifestation.abClick();
    } else {
        // Need to decide where the cost of the ai calls is going to come from.
        let costRecordName;
        
        if (ab.links.utils.isInstOwnedByStudio()) { 
            // Inst owner is likely a studio, the cost of the ai call will come from it.
            costRecordName = configBot.tags.owner;
        } else {
            // Cost of the ai call will come from the user.
            costRecordName = authBot.id;
        }

        const askGPTParams = {
            inquiry: inquiry,
            menuType: menu,
            agentMode,
            recordName: costRecordName,
            menuActionData: that,
            sourceId: 'abBot', 
            historyStorageBot: ab.links.remember
        };
        
        // Give an external bot a chance to eat the user input. If nothing takes it, then we call askGPT directly.
        let consumedInput = false;
        const receiverBots = getBots(byTag('onABUserInputAskGPT'));

        if (ab.links.remember.tags.abThinkingSound) {
            ab.links.sound.abPlaySound({ value: ab.links.remember.tags.abThinkingSound});
        }

        if (receiverBots && receiverBots.length > 0) {
            for (let receiverBot of receiverBots) {
                const result = await whisper(receiverBot, 'onABUserInputAskGPT', askGPTParams)[0];
                if (result) {
                    consumedInput = true;
                    break;
                }
            }
        }
        
        if (!consumedInput) {
            await thisBot.askGPT(askGPTParams);
        }
    }
}