if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    let scaleZ = 4;

    const abArtifactShard = {
        data: {
            hideOnLoad: that.eggParameters.hideOnLoad,
            kitId: 'navigation_kit',
            label: that.eggParameters.toolbox_name ?? "nav kit",
            studioId: that.eggParameters.studioId,
            tool_array: tags.tool_array,
            abFormAddress: tags.abFormAddress,
            abBaseScale: {
                z: scaleZ
            },
            abScale: {
                z: 1/scaleZ
            },
            abOffset: {
                z: (2/scaleZ) - 1
            },
            abOrientationMode: 'billboardFront',
            eggParameters: {
                gridInformation: {
                    dimension: dimension,
                    position: {
                        x: dimensionX,
                        y: dimensionY
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'kit'
            }
        ]
    };
    ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'kit',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
        space: thisBot.space,
    });
}

if (!configBot.tags.kitLoaderDevMode) {
    destroy(thisBot);
}