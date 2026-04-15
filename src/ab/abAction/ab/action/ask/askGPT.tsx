import { AIChatMessage } from 'casualos';

if (authBot.tags.privacyFeatures.allowAI == false) {
    const aiMessage = ab.links.remember.tags.ai_rejection_message ?? "AI not authorized for this account";
    ab.links.utils.abLogAndToast({ message: aiMessage });
    os.openQRCodeScanner();
    configBot.tags.abScan = true;
    configBot.tags.requestingAI = true;
    return;
}

if (!ab.links.todoManager) {
    // Load abTodo skill. This manages agent's working on todo bots.
    await ab.abAdapt('abTodo');
}

/**
 * Sanitizes an object in place by replacing any bot objects with their ids.
 * A bot is identified by having `id`, `tags`, and `space` properties.
 * Recursively processes nested objects and arrays.
 */
function sanitizeBotReferences(obj) {
    if (obj == null || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
        if (isBot(value)) {
            obj[key] = value.id;
        } else if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (isBot(value[i])) {
                    value[i] = value[i].id;
                } else if (value[i] != null && typeof value[i] === 'object' && !Array.isArray(value[i])) {
                    sanitizeBotReferences(value[i]);
                }
            }
        } else if (typeof value === 'object' && value !== null) {
            sanitizeBotReferences(value);
        }
    }
}

function isBot(value) {
    return (
        value != null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        'id' in value &&
        'tags' in value &&
        'space' in value
    );
}

sanitizeBotReferences(that);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

const originalUserInquiry = that.inquiry ?? that;
const abBot = that.abBot ? getBot('id', that.abBot) : ab.links.manifestation.links.abBot;
const sourceId = that.sourceId ?? uuid();
const abDimension = that.abDimension ?? ab.links.remember.tags.abActiveDimension;
const abPosition = that.abPosition ?? ab.links.remember.tags[abDimension + 'ABLastPosition'];
const patchBotDimension = that.abDimension ?? ab.links.remember.tags.abActiveDimension;
const patchBotPosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 2 };
const hasInquiry = that.inquiry != null;
const model = that.model;
const callDepth: number = that.callDepth ?? 0;
const agentMode: string | undefined = that.agentMode ?? 'build';
const historyStorageBot = that.historyStorageBot ? getBot('id', that.historyStorageBot) : undefined;
const storedHistory: AIChatMessage[] = historyStorageBot ? thisBot.abConversationHistoryGet({ historyStorageBot }) : [];
const todoBot = that.todoBot ? getBot('id', that.todoBot) : undefined;
const recordName: string | undefined = that.recordName ?? todoBot?.tags.budgetRecordName ?? authBot.id;

const MAX_CALL_DEPTH = 5;

if (callDepth >= MAX_CALL_DEPTH) {
    ab.links.utils.abLog({ message: 'AI call depth limit reached' });
    return;
}

if (callDepth === 0) {
    ab.links.utils.abLog({ message: `thinking...` });
    ab.links.manifestation.abBotChat({ bot: abBot, message: `thinking...` });
}

// ── Inner helpers ───────────────────────────────────────────────────────

/**
 * Builds the <focus> context block from the that.prompt + that.data context.
 */
function buildFocusContext() {
    if (that.prompt === 'bot' && that.data?.bot) {
        return { type: 'bot', id: that.data.bot, dimension: abDimension };
    } else if (that.prompt === 'grid' && that.data?.dimension) {
        return { type: 'grid', dimension: that.data.dimension, x: that.data.dimensionX ?? 0, y: that.data.dimensionY ?? 0 };
    } else if (that.prompt === 'multipleBot' && that.data?.bots?.length) {
        return { type: 'multipleBot', ids: that.data.bots.filter(Boolean), dimension: abDimension };
    } else {
        return { type: 'dimension', dimension: abDimension };
    }
}

/**
 * Returns bots in the inst.
 */
function getInstBots() {
    const bots = getBots((b) => {
        return b.space === 'shared' && // Bot must be in shared space.
               !b.tags.abIgnore && // Don't include ignored bots.
               !b.tags.abBot // Don't include an bots marked as belonging to ab.
    });

    return bots;
}

/**
 * Parses a JSON function call array from an AI response string.
 * Returns null if the response is not valid JSON (signals legacy code fallback).
 */
function parseFunctionCalls(response) {
    // Find the outermost [...] array — handles markdown fences and extra prose before/after the JSON.
    const start = response.indexOf('[');
    const end = response.lastIndexOf(']');
    if (start === -1 || end <= start) return null;
    // Sanitize invalid JSON escapes (\' is not valid JSON).
    const extracted = response.slice(start, end + 1);
    const sanitized = extracted.replace(/\\'/g, "'");
    try {
        const parsed = JSON.parse(sanitized);
        if (!Array.isArray(parsed)) return null;
        for (const item of parsed) {
            if (!item?.function || typeof item.function.name !== 'string') return null;
            item.function.args = item.function.args ?? {};
        }
        return parsed;
    } catch (e) {
        return null;
    }
}

/**
 * Extracts code content from an LLM response, stripping markdown
 * code fences and language tags if present.
 */
function extractCode(response) {
    const match = response.match(/```(?:\w*)\s*\n([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
}

/**
 * Spawns a patch bot with the given code.
 */
async function spawnPatchBot(code) {
    ab.links.utils.abLog({ message: `[generated code]:\n${code}` });

    const eggParameters = {
        patchCode: code,
        askInput: that,
        dimension: patchBotDimension,
        position: patchBotPosition,
        alwaysApprove: false,
    };

    const patchBotTemplate = getBot(b => b.tags.abPatchBot && !b.tags.abPatchBotIntance && !b.tags.abIgnore);

    if (patchBotTemplate) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] cloning patch bot ${patchBotTemplate.id} from template bot that was found`);
        }

        const botData = getSnapshot(patchBotTemplate);
        await ab.links.create.abCreateBots({
            botData,
            eggParameters,
            sourceEvent: 'ask_gpt',
        });
    } else {
        await ab.links.search.onLookupAskID({
            askID: 'abPatchBot',
            showIndicator: false,
            autoHatch: true,
            eggParameters,
            sourceEvent: 'ask_gpt',
            ignoreReserved: true,
        });
    }
}

/**
 * Sends generated code to an existing todo bot instead of spawning a new patch bot.
 */
async function sendCodeToTodoBot(code) {
    if (todoBot) {
        whisper(todoBot, 'updatePatch', { patchCode: code });
    }
}

/**
 * Creates todo bots via the artifact system.
 */
async function executeMakeTodos(todos) {
    const todoPlanId = uuid();

    // Direction todos are laid out in.
    const todoDir = { x: 0, y: 1, z: 0 };
    const todoSpacing = 2;

    // Figure out where to place the todo bots.
    // Grid: first todo lands directly on the clicked cell (startOffset = 0).
    // AB: first todo is one step away so it doesn't overlap ab (startOffset = 1).
    let todoDimension = abDimension ?? 'home';
    let todoBasePosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 0 };
    let todoStartOffset = 1;

    if (that.data?.menu === 'grid') {
        todoDimension = that.data.dimension;
        todoBasePosition = { x: that.data.dimensionX, y: that.data.dimensionY, z: 0 };
        todoStartOffset = 0;
    }

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

        await ab.links.artifact.abCreateArtifactPromiseBot({
            abArtifactName: 'abPatchTodo',
            abArtifactInstanceID: uuid(),
            abArtifactShard
        });
    }
}

// ── Build messages for this turn ────────────────────────────────────────

let aiChatMessages: AIChatMessage[];
// Focus is injected with every user message (fresh each turn)
const focusJson = JSON.stringify(buildFocusContext());
const modeXml = agentMode ? `\n  <mode>${agentMode}</mode>` : '';
const contextBlock = `<context>${modeXml}\n  <focus>${focusJson}</focus>\n</context>`;

if (!hasInquiry && storedHistory.length > 0) {
    // getInst continuation — history already ends with the getInst result user message
    aiChatMessages = storedHistory;
} else if (storedHistory.length > 0) {
    // New user message continuing an existing session
    aiChatMessages = [
        ...storedHistory,
        { role: 'user', content: [{ text: `${contextBlock}\n<message>${originalUserInquiry}</message>` }] }
    ];
} else {
    // Fresh start — build full initial message structure
    aiChatMessages = [
        { role: 'system', content: [{ text: tags.prompt_system }] },
        { role: 'assistant', content: [{ text: 'Understood. I will always respond with a valid JSON array of function calls and nothing else.' }] },
        { role: 'user', content: [{ text: `${contextBlock}\n<message>${originalUserInquiry}</message>` }] },
    ];
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] sending to AI (depth ${callDepth}):`, aiChatMessages);
}

// ── Call AI ─────────────────────────────────────────────────────────────

let response;
let requestErrorMsg;

try {
    response = await thisBot.submitRequestGPT({ messages: aiChatMessages, model, recordName, sourceId });
} catch (e) {
    requestErrorMsg = ab.links.utils.getErrorMessage(e);
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] raw response:`, response);
}

if (requestErrorMsg || !response) {
    if (todoBot) {
        todoBot.tags.animationState = 'error';

        if (requestErrorMsg) {
            todoBot.tags.abPatchError = `AI request failed — ${requestErrorMsg}`;
        } else {
            todoBot.tags.abPatchError = 'AI request failed — no response received';
        }
    }
    return;
}

const functionCalls = parseFunctionCalls(response);

// ── Legacy fallback ─────────────────────────────────────────────────────

if (functionCalls === null) {
    // Response is did not contain detectable function calls. Attempting to extract code from response for patch bot.
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Response is did not contain detectable function calls. Attempting to extract code from response for patch bot. Response:`, response);
    }
    const extractedCode = extractCode(response);
    if (todoBot) {
        await sendCodeToTodoBot(extractedCode);
    } else {
        await spawnPatchBot(extractedCode);
    }
    return;
}

// ── Handle getInst ──────────────────────────────────────────────────────

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] parsed functions calls:`, functionCalls);
}

const hasGetInst = functionCalls.some(fc => fc.function.name === 'getInst');

if (hasGetInst) {
    const instBots = getInstBots();
    const getInstUserMessage = `<context>${modeXml}\n  <focus>${focusJson}</focus>\n  <functionResult name="getInst">${JSON.stringify(instBots)}</functionResult>\n</context>`;

    if (historyStorageBot) {
        // Save history including the assistant's getInst call and the result.
        // The recursive call will use storedHistory directly (no new user message).
        thisBot.abConversationHistorySave({
            historyStorageBot,
            history: [
                ...aiChatMessages,
                { role: 'assistant', content: [{ text: response }] },
                { role: 'user', content: [{ text: getInstUserMessage }] },
            ]
        })
    }

    // Fire next turn as a new event-driven askGPT call (not a loop)
    await thisBot.askGPT({
        ...that,
        inquiry: undefined,
        historyStorageBot,
        callDepth: callDepth + 1,
    });
    return;
}

// ── Execute action functions ────────────────────────────────────────────

if (historyStorageBot) {
    // Save immediately before executing — history is persisted even if execution throws
    thisBot.abConversationHistorySave({
        historyStorageBot,
        history: [
            ...aiChatMessages,
            { role: 'assistant', content: [{ text: response }] }
        ]
    })
}

for (const fc of functionCalls) {
    const { name, args } = fc.function;

    if (name === 'chat') {
        ab.links.utils.abLog({ message: args.message });

    } else if (name === 'makePatch') {
        if (todoBot) {
            await sendCodeToTodoBot(args.code);
        } else {
            await spawnPatchBot(args.code);
        }

    } else if (name === 'makeTodos') {
        await executeMakeTodos(args.todos ?? []);
    }
}
