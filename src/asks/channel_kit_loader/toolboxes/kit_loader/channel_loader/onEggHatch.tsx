if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    const abArtifactShard = {
        data: {
            hideOnLoad: that.eggParameters.hideOnLoad,
            kitId: 'channel_kit',
            label: that.eggParameters.toolbox_name ?? "channel kit",
            studioId: that.eggParameters.studioId,
            tool_array: tags.tool_array,
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