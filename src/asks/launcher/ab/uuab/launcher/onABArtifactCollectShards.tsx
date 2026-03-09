const shard: ABArtifactShard = {
    data: {
        uuabMenuData: thisBot.vars.uuabMenuData,
        uuabLocked: tags.uuabLocked
    },
    dependencies: [
        {
            askID: 'launcher'
        }
    ]
}

return shard;