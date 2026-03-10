const shard: ABArtifactShard = {
    data: {
        label: tags.label,
        dimensionData: {
            dimension: ab.links.remember.tags.abActiveDimension,
            [ab.links.remember.tags.abActiveDimension]: tags[ab.links.remember.tags.abActiveDimension],
            [ab.links.remember.tags.abActiveDimension + 'X']: tags[ab.links.remember.tags.abActiveDimension + 'X'],
            [ab.links.remember.tags.abActiveDimension + 'Y']: tags[ab.links.remember.tags.abActiveDimension + 'Y'],
            [ab.links.remember.tags.abActiveDimension + 'Z']: tags[ab.links.remember.tags.abActiveDimension + 'Z'],
            [ab.links.remember.tags.abActiveDimension + 'RotationX']: tags[ab.links.remember.tags.abActiveDimension + 'RotationX'],
            [ab.links.remember.tags.abActiveDimension + 'RotationY']: tags[ab.links.remember.tags.abActiveDimension + 'RotationY'],
            [ab.links.remember.tags.abActiveDimension + 'RotationZ']: tags[ab.links.remember.tags.abActiveDimension + 'RotationZ'],
        },
        simID: tags.simID,
        color: tags.color,
        doors: tags.doors,
        labelFloatingBackgroundColor: tags.labelFloatingBackgroundColor,
        labelColor: tags.labelColor,
        placePrompt: tags.placePrompt,
        formAddress: tags.formAddress,
        chosenDimension: tags.chosenDimension      
    },
    dependencies: [
        {
            askID: 'simPlaceHD'
        }
    ]
}

return shard;