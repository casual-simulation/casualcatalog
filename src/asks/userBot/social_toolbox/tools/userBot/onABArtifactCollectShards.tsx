const shard: ABArtifactShard = {
    data: {
        label: tags.bbLabel,
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
        labelFloatingBackgroundColor: tags.bbLabelFloatingBackgroundColor,
        labelColor: tags.bbLabelColor,
        form: tags.form,
        formSubtype: tags.formSubtype,
        formAddress: tags.formAddress,
        formAddressAspectRatio: tags.formAddressAspectRatio,
        userID: tags.userID,
        pokeNotifsAllowed: tags.pokeNotifsAllowed
    },
    dependencies: [
        {
            askID: 'userBot'
        }
    ]
}

return shard;