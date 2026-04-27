const input = await os.showInput(undefined, {
    title: 'Make Image',
    placeholder: 'Describe the image to create…',
});

if (!input) return;

const params: ABAskGPTParameters = {
    inquiry: input,
    promptInjection: tags.prompt,  // pixel art system instructions from prompt.txt
    toolSourceBots: [thisBot],     // exposes abAskToolMakeImage on this bot to the AI
    agentMode: 'plan',
    abBot: thisBot,
    abDimension: 'home',
    abPosition: { x: tags.homeX ?? 0, y: tags.homeY ?? 0 },
};

ab.links.ask.askGPT(params);
