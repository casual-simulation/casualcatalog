const { 
    recordName = authBot?.id, // record name that the budget of credits will come from
    model = ab.links.personality.tags.abPreferredAIModel, // desired ai model to set on the todo (can be changed later on the todo).
    
    abDimension = ab.links.remember.tags.abActiveDimension ?? 'home', // Optional: dimensio nto place the todos, defaults to ab active dimension or home;
    abPosition = { x: 0, y: 0}, // Optional: position to place the first todo, subsequent todos in this plan will be placed alongside.
    menuActionData, // Optional: extra data that is often included with calls to abCoreMenuAction
    menuType,
    todoBot: parentTodoBot
}: ABAskContext = that.askContext;

const todos: ABTodoParameters[] = that.args.todos ?? []; // List of todos to make.
const returnType: 'none' | 'bots' = that.returnType ?? 'none'; // By default this is an action tool, meaning we dont return any bots to send back to the ai models.
const autoFocus: boolean = that.autoFocus ?? true; // After creation, focus and open the menu on the first todo. Callers doing tag post-processing (userAsk, userRequest) pass false and handle it themselves.
const autoAssignAgent: boolean = that.autoAssignAgent ?? ab.links.personality.tags.abAutoAssignAgentToTodo ?? true; // Automatically assign the todo to agents. Callers doing tag post-processing (userAsk, userRequest) pass false and handle it themselves.

const todoPlanId = uuid();
const todoDir = { x: 0, y: 1, z: 0 };
const todoSpacing = tags.todoSpacing ?? 2;

let todoParentId;

if (parentTodoBot) {
    todoParentId = typeof parentTodoBot === 'string' ? parentTodoBot : parentTodoBot.id;
}

let todoDimension = abDimension;
let todoBasePosition = { x: abPosition.x ?? 0, y: abPosition.y ?? 0, z: 0 };
let todoStartOffset = 1;

if (menuActionData?.menu === 'grid') {
    todoDimension = menuActionData.dimension;
    todoBasePosition = { x: menuActionData.dimensionX, y: menuActionData.dimensionY, z: 0 };
}

const createdBots = [];
let firstTodoBot: Bot | null = null;

const aiChatModels: any[] = configBot.tags.aiChatModels ?? [];

for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const step = todoStartOffset + i;

    // If this todo has non-image attachments, override to the best available Gemini Flash model
    // since OpenAI and Anthropic models only support image files as multimodal input (as of 2026-04-29). 
    // This ensures that the todo can be processed correctly without requiring the user to specify a compatible model.
    let effectiveModel = model;
    const hasNonImageAttachment = (todo.attachments ?? []).some(
        (a: ABAttachment) => !a.mimeType?.startsWith('image/')
    );
    if (hasNonImageAttachment) {
        const currentModelEntry = aiChatModels.find(m => m.name === model);
        if (currentModelEntry?.provider !== 'google') {
            const flashModels = aiChatModels.filter(
                m => m.provider === 'google' && m.name.toLowerCase().includes('flash')
            );
            flashModels.sort((a, b) => {
                const isLiteA = a.name.toLowerCase().includes('lite');
                const isLiteB = b.name.toLowerCase().includes('lite');
                if (isLiteA !== isLiteB) return isLiteA ? 1 : -1;
                const version = (name: string) => parseFloat(name.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? '0');
                return version(b.name) - version(a.name);
            });
            if (flashModels.length > 0) {
                effectiveModel = flashModels[0].name;
            }
        }
    }

    let computedPosition = {
        x: todoBasePosition.x + step * todoDir.x * todoSpacing,
        y: todoBasePosition.y + step * todoDir.y * todoSpacing,
        z: todoBasePosition.z + step * todoDir.z * todoSpacing
    }
    
    computedPosition = ab.links.utils.findOpenPositionAround({
        dimension: todoDimension,
        center: computedPosition,
        radius: 15,
        innerRadius: 0,
        direction: 'outward',
        spacing: 1,
    })

    const abArtifactShard: ABArtifactShard = {
        data: {
            prompt: todo.prompt,
            todoLabel: todo.label,
            attachments: todo.attachments,
            budgetCredits: todo.budget_credits,
            budgetRecordName: recordName,
            debug: tags.debug,
            aiModel: effectiveModel,
            todoPlanId,
            todoOrder: i,
            todoParentId,
            todoBaseColor: ab.links.personality.tags.abBaseColor,
            todoShowArrow: true,
            focusMenuType: menuType,
            focusMenuActionData: menuActionData,
            eggParameters: {
                gridInformation: {
                    dimension: todoDimension,
                    position: {
                        x: computedPosition.x,
                        y: computedPosition.y,
                        z: computedPosition.z,
                    }
                }
            },
            // Bake any caller-supplied extra fields into the shard so reconstitute sees them
            // before initialize runs — avoids a refreshForm race when (for example)
            // spawnUserApprovalTodo needs the bot to come up already marked as an approval.
            ...(todo.extraShardData ?? {}),
        },
        dependencies: [{ askID: 'abPatchTodo' }]
    };

    const shardBots = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'abPatchTodo',
        abArtifactInstanceID: uuid(),
        abArtifactShard
    });

    if (i === 0 && shardBots) {
        firstTodoBot = shardBots.find(b => b.tags.abPatchTodoInstance) ?? null;
    }

    if (returnType === 'bots' && shardBots) {
        createdBots.push(...shardBots);
    }
}

if (autoFocus && firstTodoBot) {
    await os.focusOn(firstTodoBot, { duration: firstTodoBot.tags.todoFocusDuration });
    whisper(firstTodoBot, 'abPatchTodoMenuOpen');
}

if (autoAssignAgent && firstTodoBot) {
    whisper(firstTodoBot, 'onAssignAgentsClick');
}

if (returnType === 'bots') {
    return createdBots;
}
