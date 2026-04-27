const { 
    recordName = authBot?.id, // record name that the budget of credits will come from
    model = ab.links.personality.tags.abPreferredAIModel, // desired ai model to set on the todo (can be changed later on the todo).
    
    abDimension = ab.links.remember.tags.abActiveDimension ?? 'home', // Optional: dimensio nto place the todos, defaults to ab active dimension or home;
    abPosition = { x: 0, y: 0}, // Optional: position to place the first todo, subsequent todos in this plan will be placed alongside.
    menuActionData, // Optional: extra data that is often included with calls to abCoreMenuAction
    promptInjection, // Optional: extra instructions appended to the base system prompt for domain-specific tools.
    toolSourceBots, // Optional: bot IDs that provide additional abAskTool* tags for AI dispatch.
} = that.askContext;

const todos: ABTodoParameters[] = that.args.todos ?? []; // List of todos to make.
const returnType: 'none' | 'bots' = that.returnType ?? 'none'; // By default this is an action tool, meaning we dont return any bots to send back to the ai models.

const todoPlanId = uuid();
const todoDir = { x: 0, y: 1, z: 0 };
const todoSpacing = 2;

let todoDimension = abDimension;
let todoBasePosition = { x: abPosition.x ?? 0, y: abPosition.y ?? 0, z: 0 };
let todoStartOffset = 1;

if (menuActionData?.menu === 'grid') {
    todoDimension = menuActionData.dimension;
    todoBasePosition = { x: menuActionData.dimensionX, y: menuActionData.dimensionY, z: 0 };
    todoStartOffset = 0;
}

const createdBots = [];

for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const step = todoStartOffset + i;
    const abArtifactShard: ABArtifactShard = {
        data: {
            prompt: todo.prompt,
            todoLabel: todo.label,
            budgetCredits: todo.budget_credits,
            budgetRecordName: recordName,
            aiModel: model,
            todoPlanId,
            todoOrder: i,
            promptInjection: promptInjection ?? null,
            toolSourceBots: toolSourceBots ?? null,
            eggParameters: {
                gridInformation: {
                    dimension: todoDimension,
                    position: {
                        x: todoBasePosition.x + step * todoDir.x * todoSpacing,
                        y: todoBasePosition.y + step * todoDir.y * todoSpacing,
                        z: todoBasePosition.z + step * todoDir.z * todoSpacing,
                    }
                }
            }
        },
        dependencies: [{ askID: 'abPatchTodo' }]
    };

    const shardBots = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'abPatchTodo',
        abArtifactInstanceID: uuid(),
        abArtifactShard
    });

    if (returnType === 'bots' && shardBots) {
        createdBots.push(...shardBots);
    }
}

if (returnType === 'bots') {
    return createdBots;
}
