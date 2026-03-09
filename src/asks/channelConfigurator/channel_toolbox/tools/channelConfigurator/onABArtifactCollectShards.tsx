const shard: ABArtifactShard = {
    data: {
        bios: tags.chosenBIOS,
        instName: tags.chosenInstName,
        defaultPattern: tags.chosenPattern,
        defaultPatternStudio: tags.chosenPatternStudio,
        channelName: tags.chosenChannelName,
        onChannelLoaded: tags.channel_onChannelLoaded,
        channelSetupLabel: tags.channelSetupLabel,
        prevBotID: thisBot.id,
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
            askID: 'channelConfigurator'
        }
    ]
}

return shard;