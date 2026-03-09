const shard: ABArtifactShard = {
    data: {
        skyboxImage: tags.formAddress,
        passedEggParameters: tags.passedEggParameters ?? null,
    },
    dependencies: [
        {
            askID: 'msSkyBot'
        }
    ]
}

return shard;