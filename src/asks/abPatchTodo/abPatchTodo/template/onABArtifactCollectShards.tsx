const shard: ABArtifactShard = {
    data: {
        dimension: tags.dimension,
        dimensionX: tags[tags.dimension + 'X'],
        dimensionY: tags[tags.dimension + 'Y'],
        dimensionZ: tags[tags.dimension + 'Z'],
        prompt: tags.prompt,
        todoLabel: tags.todoLabel,
        aiModel: tags.aiModel,
        abPatchAskInput: tags.abPatchAskInput,
        alwaysApprove: tags.alwaysApprove,
        debug: tags.debug,
    },
    dependencies: [{ askID: 'abPatchTodo '}]
}

return shard;