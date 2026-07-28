if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    console.log("kit_loader_egg_hatch", that)

    const abArtifactShard = {
        data: {
            kitId: 'advanced_kit',
            label: that.eggParameters.toolbox_name ?? "advanced kit",
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