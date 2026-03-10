for (let i = 0; i < tags.artifactLocationData.length; i++) {
    const data = tags.artifactLocationData[i].attributes;
    const artifactData = data.Artifact.data.attributes;

    const collected = tags.userData?.collectedArtifacts.find(item => item.id == data.Artifact.data.id)?.state == "collected" ? true : false;
    
    const abArtifactShard = {
        data: {
            label: artifactData.Name,
            artifactName: artifactData.Name,
            artifactDescription: artifactData.Description,
            artifactLocked: true,
            artifactID: data.Artifact.data.id,
            artifactImage: artifactData.PhotoUrl,
            realArtifactImage: artifactData.RealImageUrl,
            artifactLink: artifactData.GRPMUrl,
            artifactYear: artifactData.Year,
            collectionID: data.Collection.CollectionID,
            landmarkIDs: [data.Landmark.data.id],
            collected: collected,
            dimensionData: {
                dimension: 'home',
                home: false,
                homeX: 0,
                homeY: 0
            }
        },
        dependencies: [
            {
                askID: 'artifact'
            }
        ]
    };
    ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'artifact',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}