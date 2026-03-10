shout("rbThinkingReset");
configBot.tags.menuPortal = "rbMenu";

if (that == true) {
    let thinkingMods = {
        space: "tempLocal",
        rbMenu: true,
        rbMenuBot: true,
        rbThinkingBot: true,
        pairedRB: getLink(thisBot),
        rbMenuSortOrder: 0,
        rbThinkingReset: `@ destroy(thisBot)`,
        color: "#50E2F2",
        trackNum: 0,
        labelAlignment: "center",
        onCreate: `@
                if(tags.styleModApplied == false){
                let existingStyle = tags.menuItemStyle;
                console.log("existingStyle", existingStyle);
                existingStyle.width = "300px";
                existingStyle["align-self"] = "center"
                tags.menuItemStyle = existingStyle;
                tags.styleModApplied = true;
            }

            if (tags.trackNum == 2)
            {
                tags.trackNum = 0;
            }
            else
            {
                tags.trackNum++;
            }

            tags.label = tags["label"+tags.trackNum];
            tags.formAddress = tags["form"+tags.trackNum];

            setTimeout(() => whisper(thisBot, "onCreate"), 500);`,
        label0: thisBot.tags.name + ` is thinking.`,
        label1: thisBot.tags.name + ` is thinking..`,
        label2: thisBot.tags.name + ` is thinking...`,
        form0: "hourglass_bottom",
        form1: "hourglass_top",
        form2: "hourglass_bottom",
        loading: true,
        styleModApplied: false,
        system: "rbMenuBot.thinking",
    };

    if (!ab.links.menu) {
        // Load abInterface skill if ab.links.menu is not available.
        await ab.abAdapt('abInterface');
    }

    await ab.links.menu.abCreateMenuButton(thinkingMods);
}
else if(that == false){
    let remotes = await os.remotes();
    sendRemoteData(remotes, "stopThinking");
}