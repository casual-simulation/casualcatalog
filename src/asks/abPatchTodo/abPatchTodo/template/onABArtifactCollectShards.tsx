const shard: ABArtifactShard = {
    data: {
        prompt: tags.prompt,
        todoLabel: tags.todoLabel,
        aiModel: tags.aiModel,
        abPatchAskInput: tags.abPatchAskInput,
        alwaysApprove: tags.alwaysApprove,
        debug: tags.debug,
        eggParameters: {
            gridInformation: {
                dimension: tags.dimension,
                position: {
                    x: tags[tags.dimension + 'X'] ?? 0,
                    y: tags[tags.dimension + 'Y'] ?? 0,
                    z: tags[tags.dimension + 'Z'] ?? 0
                }
            }
        },
    },
    dependencies: [{ askID: 'abPatchTodo '}]
}

return shard;