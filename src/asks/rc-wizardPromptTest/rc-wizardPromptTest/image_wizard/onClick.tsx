const userInput = await os.showInput(undefined, {
    title: 'Make Image',
    placeholder: 'Describe the image to create…',
});

if (!userInput) return;

let inquiry = tags.baseUserPrompt;
inquiry = inquiry.replaceAll('{{botId}}', thisBot.id);
inquiry = inquiry.replaceAll('{{imageDescription}}', userInput);

const params: ABAskGPTParameters = {
    inquiry,
    inquiryLabel: userInput,
    agentMode: 'plan',
    abBot: thisBot,
    abDimension: 'home',
    abPosition: { x: tags.homeX ?? 0, y: tags.homeY ?? 0 },
};

ab.links.ask.askGPT(params);
