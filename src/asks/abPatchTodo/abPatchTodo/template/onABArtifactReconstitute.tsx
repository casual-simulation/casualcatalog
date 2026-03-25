const data = that.data;

tags.abPatchAskInput = data.abPatchAskInput;
tags.alwaysApprove = data.alwaysApprove;
tags.prompt = data.prompt;
tags.todoLabel = data.todoLabel;
tags.aiModel = data.aiModel;
tags.debug = data.debug;

tags.dimension = data.dimension ?? 'home';
tags[dimension + 'X'] = data.dimensionX ?? 0;
tags[dimension + 'Y'] = data.dimensionY ?? 0;
tags[dimension + 'Z'] = data.dimensionZ ?? 0;

tags.abPatchTodoInstance = true;

thisBot.changeAnimationState("incomplete_in");