const input = await os.showInput(undefined, { title: 'Describe image' });

if (input) {
    ab.links.ask.askGPT({
        inquiry: input,
        promptInjection: tags.prompt,
        toolSourceBots: [thisBot], 
        agentMode: 'plan',
    })
}