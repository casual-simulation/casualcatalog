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
        color: tags.color,
        labelFloatingBackgroundColor: tags.labelFloatingBackgroundColor,
        labelColor: tags.labelColor,
        simID: tags.simID,
        form: tags.form,
        formSubtype: tags.formSubtype,
        formAddress: tags.formAddress,
        formAddressAspectRatio: tags.formAddressAspectRatio,
        simAttributes: tags.simAttributesStartingValues,
        roleLocked: tags.roleLocked,
        roleName: tags.roleName,
        numUsers: tags.numUsers,
        defaultPlace: tags.defaultPlace
    },
    dependencies: [
        {
            askID: 'simRole'
        }
    ]
}

return shard;