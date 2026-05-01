const shard: ABArtifactShard = {
    data: {
        prompt: tags.prompt,
        todoLabel: tags.todoLabel,
        attachments: tags.attachments,
        todoApproved: tags.todoApproved,
        budgetCredits: tags.budgetCredits,
        budgetRecordName: tags.budgetRecordName,
        aiModel: tags.aiModel,
        agentName: tags.agentName,
        todoReadyForAgent: tags.todoReadyForAgent,
        debug: tags.debug,
        todoPlanId: tags.todoPlanId,
        todoOrder: tags.todoOrder,
        focusMenuType: tags.focusMenuType,
        focusMenuActionData: tags.focusMenuActionData,
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
    dependencies: [{ askID: 'abPatchTodo' }]
}

return shard;