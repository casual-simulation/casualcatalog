const receiptBot = create({
    abIgnore: true,
    originalPrompt: tags.originalPrompt ?? tags.userPrompt,
    prompt: tags.userPrompt,
    rawResponse: that.raw,
    parsedResponse: that.parsed,
    system: "scale_model_toolbox.scaleModelReceipt",
    creator: null
});