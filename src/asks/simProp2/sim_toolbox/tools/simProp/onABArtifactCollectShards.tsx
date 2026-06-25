const dim = tags.dimension ?? ab.links.remember.tags.abActiveDimension;
const shard: ABArtifactShard = {
    data: {
        label: tags.label,
        dimensionData: {
            dimension: dim,
            [dim]: tags[dim],
            [dim + 'X']: tags[dim + 'X'],
            [dim + 'Y']: tags[dim + 'Y'],
            [dim + 'Z']: tags[dim + 'Z'],
            [dim + 'RotationX']: tags[dim + 'RotationX'],
            [dim + 'RotationY']: tags[dim + 'RotationY'],
            [dim + 'RotationZ']: tags[dim + 'RotationZ'],
        },
        scaleX: tags.scaleX,
        scaleY: tags.scaleY,
        scaleZ: tags.scaleZ,
        color: tags.color,
        labelFloatingBackgroundColor: tags.labelFloatingBackgroundColor,
        labelColor: tags.labelColor,
        simID: tags.simID,
        propLocked: tags.propLocked,
        genForm: tags.genForm,
        imagePrompt: tags.imagePrompt
    },
    dependencies: [
        {
            askID: 'simProp2'
        }
    ]
}

return shard;