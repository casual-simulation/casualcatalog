const data = JSON.parse(that.data);

for (let i = 0; i < data.bots.length; ++i) {
    const abArtifactShard = {
        data: {
            prompt: data.bots[i].prompt,
            eggParameters: {
                gridInformation: {
                    dimension: ab.links.remember.abGridFocus?.dimension ?? tags.dimension ?? 'home',
                    position: {
                        x: ab.links.remember.abGridFocus?.position?.x ?? data.bots[i].location?.x ?? 0,
                        y: ab.links.remember.abGridFocus?.position?.x ?? data.bots[i].location?.y ?? 0
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'toDoBot'
            }
        ]
    };
    await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'toDoBot',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}

thisBot.sendToolCompleteMessage({id: that.id});