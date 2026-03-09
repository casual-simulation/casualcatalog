const shard: ABArtifactShard = {
    data: {
        managerDimension: tags.dimension,
        managerDimensionX: tags[tags.dimension + 'X'],
        managerDimensionY: tags[tags.dimension + 'Y'],
        managerDimensionZ: tags[tags.dimension + 'Z'],
    },
    dependencies: [
        { askID: 'arWebSlinger' }
    ]
}

return shard;