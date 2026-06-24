const pagePrompt = `
pageObjective: "${tags.pageObjective}",
bots: ${JSON.stringify(tags.pageBotData)},
steps: ${JSON.stringify(tags.pageData)},
`

let inquiry = tags.todoPlanPrompt;
inquiry = inquiry.replaceAll('{{pageID}}', thisBot.tags.pageID);
inquiry = inquiry.replaceAll('{{pagePrompt}}', pagePrompt);

const params: ABAskGPTParameters = {
    inquiry,
    inquiryLabel: pagePrompt,
    agentMode: 'plan',
    abBot: thisBot,
    abDimension: 'home',
    abPosition: { x: tags.homeX ?? 0, y: tags.homeY ?? 0 },
};

await ab.links.ask.askGPT(params);

if (tags.destroyAfterUse) {
    destroy(thisBot);
}