const shard: ABArtifactShard = {
    data: {
        bios: tags.bios,
        instName: tags.instName,
        defaultPattern: tags.defaultPattern,
        defaultPatternStudio: tags.defaultPatternStudio,
        channelName: tags.channelName,
        onChannelLoaded: tags.onChannelLoaded
    },
    dependencies: [
        {
            askID: 'channel'
        }
    ]
}

return shard;