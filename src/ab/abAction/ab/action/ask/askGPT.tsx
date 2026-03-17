import { AIChatMessage } from 'casualos';

if (authBot.tags.privacyFeatures.allowAI == false) {
    const aiMessage = links.remember.tags.ai_rejection_message ?? "AI not authorized for this account";
    links.utils.abLogAndToast({ message: aiMessage });
    os.openQRCodeScanner();
    configBot.tags.abScan = true;
    configBot.tags.requestingAI = true;
    return;
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
const prompt = tags.prompt_system ?? tags.prompt_core;
const abBot = that.abBot ? getBot('id', that.abBot) : links.manifestation.links.abBot;
const sourceId = that.sourceId ?? uuid();
const abDimension = that.abDimension ?? ab.links.remember.tags.abActiveDimension;
const abPosition = that.abPosition ?? ab.links.remember.tags[abDimension + 'ABLastPosition'];
const patchBotDimension = that.abDimension ?? ab.links.remember.tags.abActiveDimension;
const patchBotPosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 2 };
const conversationHistory: AIChatMessage[] = that.conversationHistory ?? [];
const callDepth: number = that.callDepth ?? 0;

const MAX_CALL_DEPTH = 5;

if (callDepth >= MAX_CALL_DEPTH) {
    links.utils.abLog({ message: 'AI call depth limit reached' });
    return;
}

links.utils.abLog({ message: `thinking about: "${originalUserInquiry}"` });
links.manifestation.abBotChat({ bot: abBot, message: `thinking about: "${originalUserInquiry}"` });

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
        return { type: 'multipleBots', ids: that.data.bots.filter(Boolean), dimension: abDimension };
    } else {
        return { type: 'dimension', dimension: abDimension };
    }
}

/**
 * Returns bots in the inst that are:
 * 1. are in the shared space
 * 2. NOT ab bots
 * 3. NOT ignored by ab.
 */
function getInstBots() {
    const bots = getBots((b) => {
        return b.space === 'shared' &&
               !b.tags.abBot &&
               !b.tags.abIgnore
    });

    return bots;
}

/**
 * Parses a JSON function call array from an AI response string.
 * Returns null if the response is not valid JSON (signals legacy code fallback).
 */
function parseFunctionCalls(response) {
    const trimmed = response.trim();
    if (!trimmed.startsWith('[')) return null;
    try {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed)) return null;
        for (const item of parsed) {
            if (!item?.function || typeof item.function.name !== 'string') return null;
            item.function.args = item.function.args ?? {};
        }
        return parsed;
    } catch (e) {
        // Retry: strip markdown fences and try again (some models wrap JSON in fences)
        const stripped = extractCode(trimmed);
        if (stripped !== trimmed && stripped.startsWith('[')) {
            try {
                const parsed = JSON.parse(stripped);
                if (Array.isArray(parsed)) return parsed;
            } catch (_) { }
        }
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
    links.utils.abLog({ message: `[generated code]:\n${code}` });

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
 * Creates todo bots via the artifact system.
 */
async function executeMakeTodos(todos) {
    for (const todo of todos) {
        const abArtifactShard = {
            data: {
                prompt: todo.prompt,
                label: todo.label ?? todo.prompt,
                eggParameters: {
                    gridInformation: {
                        dimension: abDimension ?? 'home',
                        position: { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0 }
                    }
                }
            },
            dependencies: [{ askID: 'toDoBot' }]
        };
        await ab.links.artifact.abCreateArtifactPromiseBot({
            abArtifactName: 'toDoBot',
            abArtifactInstanceID: uuid(),
            abArtifactShard,
        });
    }
}

// ── Build messages for this turn ────────────────────────────────────────

let aiChatMessages: AIChatMessage[];
// Focus is injected with every user message (fresh each turn)
const focusJson = JSON.stringify(buildFocusContext());

if (conversationHistory.length > 0) {
    // Continuation turn: history has prior messages; inject fresh focus into a
    // context-only user message (no <message> — AI already has the original request)
    aiChatMessages = [
        ...conversationHistory,
        {
            role: 'user',
            content: [{ text: `<context>\n  <focus>${focusJson}</focus>\n</context>` }]
        }
    ];
} else {
    // First turn: build initial messages from the user's inquiry
    const userMessage = `<context>\n  <focus>${focusJson}</focus>\n</context>\n<message>${originalUserInquiry}</message>`;

    aiChatMessages = [
        { role: 'system', content: [{ text: prompt }] },
        { role: 'assistant', content: [{ text: 'Understood. I will always respond with a valid JSON array of function calls and nothing else.' }] },
        { role: 'user', content: [{ text: userMessage }] },
    ];
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] sending to AI (depth ${callDepth}):`, aiChatMessages);
}

// ── Call AI ─────────────────────────────────────────────────────────────

const response = await thisBot.submitRequestGPT({ messages: aiChatMessages, model: that.model, sourceId });
if (!response) return;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] raw response:`, response);
}

const functionCalls = parseFunctionCalls(response);

// ── Legacy fallback ─────────────────────────────────────────────────────

if (functionCalls === null) {
    // Response is raw code (e.g. a runtime-loaded old-format prompt is in use)
    const extractedCode = extractCode(response);
    await spawnPatchBot(extractedCode);
    return;
}

// ── Handle getInst ──────────────────────────────────────────────────────

const hasGetInst = functionCalls.some(fc => fc.function.name === 'getInst');

if (hasGetInst) {
    const instBots = getInstBots();
    const instJson = JSON.stringify(instBots);

    const updatedHistory: AIChatMessage[] = [
        ...aiChatMessages,
        { role: 'assistant', content: [{ text: response }] },
        { role: 'user', content: [{ text: `<context>\n  <functionResult name="getInst">${instJson}</functionResult>\n</context>` }] },
    ];

    // Fire next turn as a new event-driven askGPT call (not a loop)
    await thisBot.askGPT({
        ...that,
        conversationHistory: updatedHistory,
        callDepth: callDepth + 1,
    });
    return;
}

// ── Execute action functions ────────────────────────────────────────────

for (const fc of functionCalls) {
    const { name, args } = fc.function;

    if (name === 'chat') {
        links.utils.abLog({ message: args.message });
        links.manifestation.abBotChat({ bot: abBot, message: args.message });

    } else if (name === 'makePatch') {
        await spawnPatchBot(args.code);

    } else if (name === 'makeTodos') {
        await executeMakeTodos(args.todos ?? []);
    }
}
