const shard: ABArtifactShard = {
    data: {
        uuabMenuData: thisBot.vars.uuabMenuData,
        uuabLocked: tags.uuabLocked,
        uuabUsingCameraBackground: tags.uuabUsingCameraBackground
    },
    dependencies: [
        {
            askID: 'launcher'
        }
    ]
}

return shard;