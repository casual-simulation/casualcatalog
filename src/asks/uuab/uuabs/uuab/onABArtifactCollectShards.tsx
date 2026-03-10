const shard: ABArtifactShard = {
    data: {
        bios: tags.bios,
        instName: tags.instName,
        defaultPattern: tags.defaultPattern,
        defaultPatternStudio: tags.defaultPatternStudio,
        uuabName: tags.uuabName,
        onUUABLoaded: tags.onUUABLoaded
    },
    dependencies: [
        {
            askID: 'uuab'
        }
    ]
}

return shard;