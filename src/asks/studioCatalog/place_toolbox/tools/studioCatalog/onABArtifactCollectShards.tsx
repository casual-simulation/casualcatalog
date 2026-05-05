const shard: ABArtifactShard = {
    data: {
        respawnPoint: tags.respawnPoint,
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
        scaleX: tags.scaleX,
        scaleY: tags.scaleY,
        scaleZ: tags.scaleZ,
        color: tags.color,
        labelFloatingBackgroundColor: tags.labelFloatingBackgroundColor,
        labelColor: tags.labelColor,
        studioId: tags.studioId,
        prevBotID: getID(thisBot),
        toolbox_array: tags.toolbox_array,
    },
    dependencies: [
        {
            askID: 'studioCatalog'
        }
    ]
}

return shard;