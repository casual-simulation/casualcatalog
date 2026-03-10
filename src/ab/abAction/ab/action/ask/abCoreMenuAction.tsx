const inquiry = that?.message ?? that;
const initialBoot = that?.initialBoot ?? false;
const autoHatch = that?.autoHatch ?? false;
const menu = that?.menu ?? "core";
const inquiryHasSpace = inquiry.indexOf(" ") !== -1;
const menuBots = getBots(configBot.tags.menuPortal, true);
const isChannel = that.isChannel ?? false;
const isUUAB = that.isUUAB ?? false;

whisper(menuBots, "abMenuRefresh");

let username = "user";
if (authBot && authBot.tags.name) {
    username = authBot.tags.name;
} else if (ab.links.console.masks.preferredName) {
    username = ab.links.console.masks.preferredName;
}

ab.log({ message: inquiry, name: username });

if (!configBot.tags.tagPortal && links.manifestation.tags.abAwake && inquiry != ".log") {
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

    const ask: ABLookupAskIDResult | false = !isDirectSearch ? await links.search.onLookupAskID({ askID: inquiry, autoHatch: true, eggParameters, sourceEvent: 'ask' }) : false;

    if (ask?.success && ask?.data?.url != undefined && !isDirectSearch && !isChannel) {
        links.learn.abJoinHost({ data: ask.data });
    } else if (!ask?.success) {
        let egg: ABLookupEggResult;
        const periodIndex = inquiry.indexOf(".");
        let abID = inquiry;

        if (isDirectSearch) {
            abID = inquiry.substring(1, inquiry.length - 1);
        }

        if (periodIndex == -1 || isDirectSearch) {
            egg = await links.search.onLookupABEggs({ abID: abID, initialBoot, autoHatch, eggParameters, sourceEvent: 'ask' });
        } else if (periodIndex > 0) {
            const recordKey = inquiry.substring(0, periodIndex);

            abID = inquiry.substring(periodIndex + 1);

            egg = await links.search.onLookupABEggs({ recordKey: recordKey, abID: abID, initialBoot, autoHatch, eggParameters, sourceEvent: 'ask', });
        } else {
            links.input.onChat({ message: inquiry });
        }

        if (!egg?.success && links.menu) {
            configBot.masks.menuPortal = "abMenu";

            const studioButton = {};

            studioButton.abMenu = true;
            studioButton.label = abID + " not found in active studio, enter alternate studioID";
            studioButton.form = "input";
            studioButton.abID = abID;
            studioButton.formAddress = tags.abCoreMenuIcon;
            studioButton.manager = getLink(thisBot);
            studioButton.abMenuRefresh = "@ destroy(thisBot);";
            studioButton.onSubmit = `@ links.manager.abCoreMenuAction(that.text + "." + tags.abID);`;

            const createButton = {};

            createButton.abMenu = true;
            createButton.label = "give me a prototype";
            createButton.manager = getLink(thisBot);
            createButton.abMenuRefresh = "@ destroy(thisBot);";
            createButton.abID = abID;
            createButton.onClick = `@ links.manager.prototype(tags.abID);`;

            links.menu.abCreateMenuButton(createButton);
            links.menu.abCreateMenuButton(studioButton);

            thisBot.masks.onGridClick = "@ shout('abMenuRefresh');";
        }
    }
} else {
    await os.requestAuthBot();

    if (!authBot) {
        os.toast("please sign in to access advanced AI features");

        links.manifestation.abClick();
    } else {
        if (ab.links.remember.tags.abThinkingSound) {
            ab.links.sound.abPlaySound({ value: ab.links.remember.tags.abThinkingSound});
        }
        
        await thisBot.askGPT({ inquiry: inquiry, prompt: menu, data: that, sourceId: 'abBot' });
    }
}