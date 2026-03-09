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
        form: tags.form,
        formSubtype: tags.formSubtype,
        formAddress: tags.formAddress,
        formAddressAspectRatio: tags.formAddressAspectRatio,
        artifactName: tags.artifactName,
        artifactLink: tags.artifactLink,
        landmarkIDs: tags.landmarkIDs,
        artifactID: tags.artifactID,
        artifactImage: tags.artifactImage,
        artifactDescription: tags.artifactDescription,
        collectionID: tags.collectionID,
        realArtifactImage: tags.realArtifactImage,
        artifactYear: tags.artifactYear,
        artifactLocked: tags.artifactLocked,
        collected: tags.collected
    },
    dependencies: [
        {
            askID: 'artifact'
        }
    ]
}

return shard;