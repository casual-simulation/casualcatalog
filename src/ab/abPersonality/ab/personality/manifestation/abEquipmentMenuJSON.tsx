return ( {
    label: `wake ${abPersonality.tags.abBuilderIdentity}`,
    formAddress: 'alarm',
    onClick: `@
        ab.links.manifestation.abSetAwake({awake: true});
    `
})