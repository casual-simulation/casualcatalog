if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

const data = that.data;

tags.prompt = data.prompt;
tags.todoLabel = data.todoLabel;
tags.attachments = data.attachments ?? [];
tags.todoApproved = data.todoApproved;
tags.budgetCredits = data.budgetCredits;
tags.budgetRecordName = data.budgetRecordName;
tags.aiModel = data.aiModel ?? ab.links.personality.tags.abPreferredAIModel;
tags.agentName = data.agentName ?? null;
tags.todoReadyForAgent = data.todoReadyForAgent ?? false;
tags.debug = data.debug;
tags.agentMode = data.agentMode ?? 'build';
tags.todoPlanId = data.todoPlanId;
tags.todoOrder = data.todoOrder ?? 0;
tags.system = `abPatchTodo.${(tags.todoPlanId ?? thisBot.id).substring(0, 5)}_${String(tags.todoOrder).padStart(3, '0')}`;
tags.playedCreateSound = data.playedCreateSound;

if (data.eggParameters) {
    if (data.eggParameters.gridInformation) {
        const dimension = data.eggParameters.gridInformation.dimension ?? 'home';
        const dimensionX = data.eggParameters.gridInformation.position?.x ?? 0;
        const dimensionY = data.eggParameters.gridInformation.position?.y ?? 0;
        const dimensionZ = data.eggParameters.gridInformation.position?.z ?? 0;

        tags.dimension = dimension;
        tags[dimension] = true;
        tags[dimension + 'X'] = dimensionX;
        tags[dimension + 'Y'] = dimensionY;
        tags[dimension + 'Z'] = dimensionZ;
    }
}

tags.abPatchTodoInstance = true;