if (!ab.links.menu) {
    // Load abInterface skill if ab.links.menu is not available.
    await ab.abAdapt('abInterface');
}

shout("resetRBMenu");

const state = typeof that == "string" ? that : undefined;
const baseMenuMods = {
    space: "tempLocal",
    rbMenu: true,
    rbMenuBot: true,
    color: "white",
    pairedRB: getLink(thisBot),
    resetRBMenu: `@ destroy(thisBot)`,
}
const menuItems = [];

switch (state) {
    // case "chatInput":
    //     let inputMods = {
    //         form: "input",
    //         formAddress: "edit",
    //         label: "Chat with everyone!",
    //         system: "rbMenuBot.input",
    //         rbMenuSortOrder: 1,
    //         onSubmit: tags.onSubmit
    //     };
    //     menuItems.push({ ...baseMenuMods, ...inputMods });
    //     break;
    case "mainMenu":
        let modeDisplay = tags.currentMode == "learning" ? "learn" :
            tags.currentMode == "whisper" ? "direct message" :
                tags.currentMode == "shout" ? "chat with everyone" :
                    tags.currentMode == "sleep" ? "sleep" : "unknown"
        let rbModeMods = {
            formAddress: "arrow_right",
            label: `cb mode: ${modeDisplay}`,
            // resetLabel: `@ 
            //     let mode
            //     switch(getTag(links.pairedRB, "currentMode")){
            //         case "learning":
            //             mode = "learn";
            //             break;
            //         case "whisper":
            //             mode = "direct message";
            //             break;
            //         case "shout":
            //             mode = "chat with everyone";
            //             break;
            //         case "action":
            //             mode = "action";
            //             break;
            //         default:
            //             mode = "sleep";
            //             break;
            //     }
            //     tags.label = "cb mode: " + mode
            // `,
            system: "rbMenuBot.rbMode",
            rbMenuSortOrder: 1,
            dropdownSortOrder: 1,
            dropdownOptions: [
                {
                    label: "sleep",
                    mode: "sleep",
                    pairedRB: getLink(thisBot),
                    system: "rbMenuBot.sleepMode",
                    color: "white",
                    onClick: `@ 
                        setTag(links.pairedRB, "currentMode", "sleep"); 
                        links.pairedRB._menu_setRBMenuState("mainMenu");
                        links.pairedRB._utility_updateVar({ varName: "playHumeAudio", varValue: false });
                    `
                },
                {
                    label: "learn",
                    mode: "learning",
                    pairedRB: getLink(thisBot),
                    system: "rbMenuBot.learningMode",
                    color: "white",
                    onClick: `@ 
                        setTag(links.pairedRB, "currentMode", "learning"); 
                        links.pairedRB._menu_setRBMenuState("mainMenu");
                    `
                },
                {
                    label: "direct message",
                    mode: "whisper",
                    pairedRB: getLink(thisBot),
                    system: "rbMenuBot.whisperMode",
                    color: "white",
                    onClick: `@ 
                        setTag(links.pairedRB, "currentMode", "whisper"); 
                        links.pairedRB._menu_setRBMenuState("mainMenu");
                    `
                },
                {
                    label: "chat with everyone",
                    mode: "shout",
                    pairedRB: getLink(thisBot),
                    system: "rbMenuBot.shoutMode",
                    color: "white",
                    onClick: `@ 
                        setTag(links.pairedRB, "currentMode", "shout"); 
                        links.pairedRB._menu_setRBMenuState("mainMenu");
                    `
                }
            ],
        };
        rbModeMods.dropdownOptions = rbModeMods.dropdownOptions.filter(option => option.mode != tags.currentMode);

        let aiModelMods = {
            formAddress: "arrow_right",
            label: `model: ${tags.aiModel}`,
            resetLabel: `@ tags.label = "model: " + getTag(links.pairedRB, "aiModel")`,
            system: "rbMenuBot.aiMenu",
            rbMenuSortOrder: 2,
            dropdownSortOrder: 2,
            dropdownOptions: [],
        };

        const modelArray = (configBot.tags.aiChatModels ?? []).map(e => e.name);
        for (let i = 0; i < modelArray.length; i++) {
            let aiModelSubMods = {
                label: tags.aiModel == modelArray[i] ? `${modelArray[i]} (current)` : modelArray[i],
                model: modelArray[i],
                system: `rbMenuBot.aiModel${i}`,
                onClick: `@ 
                    setTag(links.pairedRB, "aiModel", "${modelArray[i]}"); 
                    links.pairedRB._menu_setRBMenuState("mainMenu");
                `
            }
            tags.aiModel == modelArray[i] ? null : aiModelMods.dropdownOptions.push({ ...baseMenuMods, ...aiModelSubMods });
        };

        let audioChatMods = {
            formAddress: tags.audioChat == true ? "check_box" : "check_box_outline_blank",
            label: `voice: ${tags.audioChat == true ? "on" : tags.audioChat == "loading" ? "loading..." : "off"}`,
            resetACLabel: `@
                let pairedOnOff = getTag(links.pairedRB, "audioChat");
                let onOff = pairedOnOff == true ? "on" : pairedOnOff == "loading" ? "loading..." : "off"; 
                tags.label = "voice: " + onOff;
                tags.formAddress = pairedOnOff == true ? "check_box" : "check_box_outline_blank";
            `,
            system: "rbMenuBot.audioChat",
            rbMenuSortOrder: 3,
            audioChat: tags.audioChat,
            onClick: `@ 
                let speakingBots = getBots(byTag("audioChat", true), byTag("rhetoricBotTool", true));
                console.log("speaking bots check:", speakingBots, links.pairedRB)
                if(speakingBots.length == 0 || (speakingBots.length == 1 && speakingBots[0].id == links.pairedRB.id)){
                    let pairedOnOff = getTag(links.pairedRB, "audioChat");
                    let onOffState = pairedOnOff == true ? true : pairedOnOff == "loading" ? "loading" : false;

                    if(onOffState == true){
                        links.pairedRB._audio_endAudioChat();
                    }
                    else if(onOffState == false){
                        links.pairedRB._audio_startAudioChat();
                    }
                }
                else {
                    os.toast("Only one chat bot can speak at a time.");
                }
            `,
        };

        let showMemoryMods = {
            formAddress: tags.hideMemory ? "check_box_outline_blank" : "check_box",
            label: "show memory",
            system: "rbMenuBot.showMemory",
            rbMenuSortOrder: 4,
            onClick: `@ 
                if(configBot.tags.mapPortal){
                    os.toast("Memory disabled while in the map portal.");
                }
                else {
                    console.log(links.pairedRB)
                    tags.formAddress = links.pairedRB.tags.hideMemory ? "check_box" : "check_box_outline_blank"; 
                    setTag(links.pairedRB, "hideMemory", !links.pairedRB.tags.hideMemory);
                    links.pairedRB.tags.hideMemory == false ? links.pairedRB._brain_createFGBNeurons() : shout("removeNeuronBots");
                }
            `
        };

        let askRBMods = {
            form: "input",
            label: `direct message cb ${String(thisBot.id).substring(0, 4)}`,
            system: "rbMenuBot.privateInput",
            rbMenuSortOrder: 5,
            onSubmit: tags._console_onSubmitPrivate
        };

        menuItems.push({ ...baseMenuMods, ...rbModeMods });
        menuItems.push({ ...baseMenuMods, ...aiModelMods });
        menuItems.push({ ...baseMenuMods, ...audioChatMods });
        menuItems.push({ ...baseMenuMods, ...showMemoryMods });
        menuItems.push({ ...baseMenuMods, ...askRBMods });
        break;
    default:
        // let defaultInputMods = {
        //     form: "input",
        //     formAddress: "edit",
        //     label: "Chat with everyone!",
        //     system: "rbMenuBot.input",
        //     rbMenuSortOrder: 1,
        //     onSubmit: tags.onSubmit
        // };
        // menuItems.push({ ...baseMenuMods, ...defaultInputMods });
        console.log("Rhetoric Bot menu state not supported.")
        break;
}

// console.log("menuItems", menuItems);

for (const item of menuItems) {
    if (item.dropdownOptions) {
        ab.links.menu.abCreateMenuDropdown(item);
    }
    else {
        ab.links.menu.abCreateMenuButton(item);
    }

}

configBot.tags.menuPortal == "rbMenu" ? null : configBot.tags.menuPortal = "rbMenu";