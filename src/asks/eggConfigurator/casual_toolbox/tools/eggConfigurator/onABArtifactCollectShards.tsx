const shard: ABArtifactShard = {
    data: {
        eggName: tags.chosenEggName,
        eggStudio: tags.chosenStudio,
        eggSetupLabel: tags.eggSetupLabel,
        eggConfigConfirmed: tags.eggConfigConfirmed,
        prevBotID: thisBot.id,
        color: tags.color,
        labelFloatingBackgroundColor: tags.eggSetupLabelFloatingBackgroundColor,
        labelColor: tags.eggSetupLabelColor,
        studioStationID: tags.studioStationID,
        lineTo: tags.lineTo,
        dimensionData: {
            dimension: ab.links.remember.tags.abActiveDimension,
            [ab.links.remember.tags.abActiveDimension]: tags[ab.links.remember.tags.abActiveDimension],
            [ab.links.remember.tags.abActiveDimension + 'X']: tags[ab.links.remember.tags.abActiveDimension + 'X'],
            [ab.links.remember.tags.abActiveDimension + 'Y']: tags[ab.links.remember.tags.abActiveDimension + 'Y'],
            [ab.links.remember.tags.abActiveDimension + 'Z']: tags[ab.links.remember.tags.abActiveDimension + 'Z'],
            [ab.links.remember.tags.abActiveDimension + 'RotationX']: tags[ab.links.remember.tags.abActiveDimension + 'RotationX'],
            [ab.links.remember.tags.abActiveDimension + 'RotationY']: tags[ab.links.remember.tags.abActiveDimension + 'RotationY'],
            [ab.links.remember.tags.abActiveDimension + 'RotationZ']: tags[ab.links.remember.tags.abActiveDimension + 'RotationZ'],
        }
    },
    dependencies: [
        {
            askID: 'eggConfigurator'
        }
    ]
}

return shard;