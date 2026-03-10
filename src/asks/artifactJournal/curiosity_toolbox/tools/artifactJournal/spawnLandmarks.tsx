for (let i = 0; i < tags.landmarkData.length; i++) {
    const data = tags.landmarkData[i].attributes;

    const discovered = tags.userData?.discoveredLandmarks.includes(tags.landmarkData[i].id);
    
    const abArtifactShard = {
        data: {
            label: data.Name,
            landmarkDescription: data.Description,
            landmarkLocked: true,
            landmarkName: data.Name,
            landmarkID: tags.landmarkData[i].id,
            landmarkImg: data.PhotoUrl,
            discovered: discovered,
            dimensionData: {
                dimension: 'home',
                home: true,
                homeX: data.Longitude,
                homeY: data.Latitude
            }
        },
        dependencies: [
            {
                askID: 'landmark'
            }
        ]
    };
    ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'landmark',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}