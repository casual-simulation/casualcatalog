if (that.portal === 'systemPortal') {
    if (!configBot.tags.codeToolsPortal) {
        configBot.masks.codeToolsPortal = 'abTestTools';

        destroy(getBots(
            byTag('abTestTools', true),
            bySpace('tempLocal')
        ));

        const runTestsButton = create({
            space: 'tempLocal',
            abTestTools: true,
            label: 'Run Tests',
            onClick: `@shout("abRunTests")`,
        });

        thisBot.masks.runTestsButton = runTestsButton.link;
    }
}