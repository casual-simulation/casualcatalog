let message = "LOADING";

const statusBar = {
    space: "tempLocal",
    color: "#50E2F2",
    bbSkybox: true,
    loadMenuReset: "@ destroy(thisBot)",
    trackNum: 0,
    labelAlignment:"center",
    // menuItemStyle: {width: "30%"},
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
    label0: `${message}.`,
    label1: `${message}..`,
    label2: `${message}...`,
    form0: "hourglass_bottom",
    form1: "hourglass_top",
    form2: "hourglass_bottom",
    loading: true,
    styleModApplied: false,
    system: "skyboxAction.loadingBot",
}

let newStatusBar = await thisBot.addMenuItem(statusBar);
return newStatusBar;