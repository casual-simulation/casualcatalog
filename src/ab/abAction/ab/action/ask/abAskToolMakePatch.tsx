const { todoBot, patchBotDimension, patchBotPosition, originalUserInquiry } = that.askContext;
const code = that.args.code;

if (todoBot) {
    whisper(todoBot, 'updatePatch', { patchCode: code });
} else {
    ab.links.utils.abLog({ message: `[generated code]:\n${code}` });

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
