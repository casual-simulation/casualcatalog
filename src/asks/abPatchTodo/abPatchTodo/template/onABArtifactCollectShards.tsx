const shard: ABArtifactShard = {
    data: {
        prompt: tags.prompt,
        abTodoComplete: tags.abTodoComplete,
        animationState: tags.animationState,
        todoLabel: tags.todoLabel,
        attachments: tags.attachments,
        todoApproved: tags.todoApproved,
        budgetCredits: tags.budgetCredits,
        budgetRecordName: tags.budgetRecordName,
        aiModel: tags.aiModel,
        agentName: tags.agentName,
        debug: tags.debug,
        todoPlanId: tags.todoPlanId,
        todoOrder: tags.todoOrder,
        todoParentId: tags.todoParentId,
        todoBaseColor: tags.todoBaseColor,
        isUserAskTodo: tags.isUserAskTodo,
        isUserApprovalTodo: tags.isUserApprovalTodo,
        todoApprovalForPlanId: tags.todoApprovalForPlanId,
        todoShowArrow: tags.todoShowArrow,
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