let inquiry = tags.todoPlanPrompt;
inquiry = inquiry.replaceAll('{{botId}}', thisBot.id);
inquiry = inquiry.replaceAll('{{userPrompt}}', that);

const params: ABAskGPTParameters = {
    inquiry,
    inquiryLabel: that,
    agentMode: 'plan',
    abBot: thisBot,
    abDimension: 'home',
    abPosition: { x: tags.homeX ?? 0, y: tags.homeY ?? 0 },
};

ab.links.ask.askGPT(params);