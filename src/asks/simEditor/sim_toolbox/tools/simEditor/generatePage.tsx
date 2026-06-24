let inquiry = tags.todoPlanPrompt;
inquiry = inquiry.replaceAll('{{pageID}}', thisBot.tags.pageID);
inquiry = inquiry.replaceAll('{{pagePrompt}}', that);

const params: ABAskGPTParameters = {
    inquiry,
    inquiryLabel: that,
    agentMode: 'plan',
    abBot: thisBot,
    abDimension: 'home',
    abPosition: { x: tags.homeX ?? 0, y: tags.homeY ?? 0 },
};

await ab.links.ask.askGPT(params);

if (tags.destroyAfterUse) {
    destroy(thisBot);
}