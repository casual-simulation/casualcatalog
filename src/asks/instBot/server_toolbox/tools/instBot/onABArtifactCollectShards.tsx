const shard: ABArtifactShard = {
    data: {
        label: tags.label,
        biosSetting: tags.biosSetting,
        creationTime: tags.creationTime,
        expirationTime: tags.expirationTime,
        instSetting: tags.instSetting,
        instURL: tags.instURL,
        patternSetting: tags.patternSetting,
        studioSetting: tags.studioSetting,
        lineTo: tags.lineTo,
        versionSetting: tags.versionSetting,
        color: tags.color,
        channelSetting: tags.channelSetting,
        scale: tags.scale,
        expiredInstBot: tags.expiredInstBot,
        studioStationID: tags.studioStationID,

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
            askID: 'instBot'
        }
    ]
}

return shard;