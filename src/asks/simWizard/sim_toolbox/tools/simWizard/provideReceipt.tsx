const receiptBot = create({
    abIgnore: true,
    originalPrompt: tags.originalPrompt ?? tags.userPrompt,
    prompt: tags.userPrompt,
    rawResponse: that.raw,
    parsedResponse: that.parsed,
    system: "sim_toolbox.simReceipt",
    onClick: `@
        configBot.tags.tagPortal = getID(thisBot) + ".parsedResponse"; 
    `,
    blueprint: true,
    blueprintX: -13,
    blueprintY: -25,
    label: 'sim receipt',
    labelColor: 'black',
    scaleX: 2,
    scaleY: 4,
    scaleZ: 0.1,
    labelWordWrapMode: 'breakWords',
    creator: null,
    onCreate: `@await os.sleep(500);
    tags.labelColor = 'black';`
});