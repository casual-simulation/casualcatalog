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
// Straight +y column; the -x drift comes from the column placement below, not the step dir.
const todoDir = tags.todoDir ?? { x: 0, y: 1, z: 0 };
const todoSpacing = tags.todoSpacing ?? 2;

let todoParentId;
let parentBot = null;

if (parentTodoBot) {
    parentBot = typeof parentTodoBot === 'string' ? getBot('id', parentTodoBot) : parentTodoBot;
    todoParentId = typeof parentTodoBot === 'string' ? parentTodoBot : parentTodoBot.id;
}

// Owner + base color form an inheritance chain. Child todos (made by an agent executing a
// parent todo) inherit the parent's owner and color so the chain stays consistent no matter
// which user is currently driving the agent cycle. The top-of-chain user request todo (no
// parent) takes its owner from the current user and its color from ab's personality.
const todoOwnerId = parentBot ? parentBot.tags.ownerId : authBot?.id;
const todoOwnerDisplayName = parentBot ? parentBot.tags.ownerDisplayName : await ab.links.console.getUserName();
const todoBaseColor = parentBot ? parentBot.tags.todoBaseColor : ab.links.personality.tags.abBaseColor;

let todoDimension = abDimension;
let todoBasePosition = { x: abPosition.x ?? 0, y: abPosition.y ?? 0, z: 0 };
let todoStartOffset = 1;

if (menuActionData?.menu === 'grid') {
    todoDimension = menuActionData.dimension;
    todoBasePosition = { x: menuActionData.dimensionX, y: menuActionData.dimensionY, z: 0 };
}

// Place the chain as one straight column, shifting it -x only to dodge bots. Child chains start
// one lane -x of the anchor; the root todo starts on it.
const columnSpacing = todoSpacing;

// Snapshot occupied tiles (rounded to whole tiles for a reliable collision check).
const tileKey = (x: number, y: number) => `${Math.round(x)},${Math.round(y)}`;
const occupiedTiles = new Set<string>();
getBots((b) => {
    if (b.tags[todoDimension]) {
        const p = getBotPosition(b, todoDimension);
        occupiedTiles.add(tileKey(p.x, p.y));
    }
});

// Per-todo offsets from the base, before the -x lane shift.
const columnOffsets = todos.map((_, i) => {
    const step = todoStartOffset + i;
    return {
        dx: step * todoDir.x * todoSpacing,
        dy: step * todoDir.y * todoSpacing,
        dz: step * todoDir.z * todoSpacing,
    };
});

// First -x lane where the whole column is clear. null => fall back to per-todo search.
const firstLaneOffset = parentBot ? columnSpacing : 0;
const MAX_LANES = 64;
let laneShiftX: number | null = null;
for (let lane = 0; lane < MAX_LANES; lane++) {
    const shiftX = -(firstLaneOffset + lane * columnSpacing);
    const clear = columnOffsets.every((o) =>
        !occupiedTiles.has(tileKey(todoBasePosition.x + shiftX + o.dx, todoBasePosition.y + o.dy))
    );
    if (clear) {
        laneShiftX = shiftX;
        break;
    }
}

const createdBots = [];
let firstTodoBot: Bot | null = null;

const aiChatModels: any[] = configBot.tags.aiChatModels ?? [];

for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

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

    const offset = columnOffsets[i];
    let computedPosition;
    if (laneShiftX !== null) {
        // Straight column: every todo shares the chosen -x lane.
        computedPosition = {
            x: todoBasePosition.x + laneShiftX + offset.dx,
            y: todoBasePosition.y + offset.dy,
            z: todoBasePosition.z + offset.dz,
        };
    } else {
        // No clear lane: per-todo open search (avoids overlap, not straight), biased -x.
        computedPosition = ab.links.utils.findOpenPositionAround({
            dimension: todoDimension,
            center: {
                x: todoBasePosition.x + offset.dx,
                y: todoBasePosition.y + offset.dy,
                z: todoBasePosition.z + offset.dz,
            },
            radius: 15,
            innerRadius: 0,
            direction: 'outward',
            spacing: 1,
            preferAngle: Math.PI,
        })
    }

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
            todoBaseColor,
            ownerId: todoOwnerId,
            ownerDisplayName: todoOwnerDisplayName,
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
    os.focusOn(firstTodoBot, { duration: firstTodoBot.tags.todoFocusDuration }).catch(() => {});
    ab.links.todo.abPatchTodoMenuOpen(firstTodoBot);
}

if (autoAssignAgent && firstTodoBot) {
    ab.links.todo.onAssignAgentsClick(firstTodoBot);
}

if (returnType === 'bots') {
    return createdBots;
}
