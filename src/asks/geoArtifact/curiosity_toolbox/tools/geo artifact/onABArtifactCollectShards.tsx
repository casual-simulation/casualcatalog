const shard: ABArtifactShard = {
    data: {
        artifactTitle: tags.artifactTitle,
        artifactDescription: tags.artifactDescription,
        artifactLink: tags.artifactLink,
        longitude: tags.longitude,
        latitude: tags.latitude,
        artifactLocked: tags.artifactLocked,

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
        form: tags.form,
        formSubtype: tags.formSubtype,
        formAddress: tags.formAddress,
        formAddressAspectRatio: tags.formAddressAspectRatio
    },
    dependencies: [
        {
            askID: 'artifactJournal'
        }
    ]
}

return shard;