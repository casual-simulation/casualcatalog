const data = that.data;

tags.abPatchAskInput = data.abPatchAskInput;
tags.alwaysApprove = data.alwaysApprove;
tags.prompt = data.prompt;
tags.todoLabel = data.todoLabel;
tags.aiModel = data.aiModel;
tags.debug = data.debug;

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

thisBot.changeAnimationState("incomplete_in");