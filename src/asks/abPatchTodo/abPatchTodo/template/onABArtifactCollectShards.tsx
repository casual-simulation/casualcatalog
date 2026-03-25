const shard: ABArtifactShard = {
    data: {
        dimension: tags.dimension,
        dimensionX: tags[tags.dimension + 'X'],
        dimensionY: tags[tags.dimension + 'Y'],
        dimensionZ: tags[tags.dimension + 'Z'],
        prompt: tags.prompt,
        abPatchAskInput: tags.abPatchAskInput,
        alwaysApprove: tags.alwaysApprove,
        aiModel: tags.aiModel,
        debug: tags.debug,
    },
    dependencies: [{ askID: 'abPatchTodo '}]
}

return shard;