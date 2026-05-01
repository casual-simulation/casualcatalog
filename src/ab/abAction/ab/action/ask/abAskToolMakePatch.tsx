const { todoBot, patchBotDimension, patchBotPosition, originalUserInquiry } = that.askContext;
const code = that.args.code;

if (todoBot) {
    whisper(todoBot, 'updatePatch', { patchCode: code });
} else {
    const name = thisBot.abAskHelperGetAgentName({ askContext: that.askContext });
    ab.links.utils.abLog({ name, message: `[generated code]:\n${code}` });

    const eggParameters = {
        patchCode: code,
        askInput: originalUserInquiry,
        dimension: patchBotDimension,
        position: patchBotPosition,
        alwaysApprove: false,
    };

    await ab.links.search.onLookupAskID({
        askID: 'abPatchBot',
        showIndicator: false,
        autoHatch: true,
        eggParameters,
        sourceEvent: 'ask_gpt',
        ignoreReserved: true,
    });
}
