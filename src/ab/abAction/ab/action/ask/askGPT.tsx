import { AIChatMessage } from 'casualos';
const askThat = that as ABAskGPTParameters;

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

thisBot.abAskHelperSanitizeBotReferences({ obj: askThat });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, askThat);
}

const originalUserInquiry = askThat.inquiry ?? askThat;
const originalUserInquiryLabel = askThat.inquiryLabel ?? originalUserInquiry.slice(0, 40);
const abBot = askThat.abBot ? getBot('id', askThat.abBot) : ab.links.manifestation.links.abBot;
const sourceId = askThat.sourceId ?? uuid();
const abDimension = askThat.abDimension ?? ab.links.remember.tags.abActiveDimension;
const abPosition = askThat.abPosition ?? ab.links.remember.tags[abDimension + 'ABLastPosition'];
const patchBotDimension = askThat.abDimension ?? ab.links.remember.tags.abActiveDimension;
const patchBotPosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 2 };
const hasInquiry = askThat.inquiry != null;
const model = askThat.model;
const callDepth: number = askThat.callDepth ?? 0;
const todoBot = askThat.todoBot ? getBot('id', askThat.todoBot) : undefined;
const agentMode: string = todoBot?.tags.agentMode ?? askThat.agentMode ?? 'build';
const historyStorageBot = askThat.historyStorageBot ? getBot('id', askThat.historyStorageBot) : undefined;
const storedHistory: AIChatMessage[] = historyStorageBot ? thisBot.abConversationHistoryGet({ historyStorageBot }) : [];
const recordName: string | undefined = askThat.recordName ?? todoBot?.tags.budgetRecordName ?? authBot.id;
const menuType = askThat.menuType;
const menuActionData = askThat.menuActionData;
const attachments: ABAttachment[] = askThat.attachments ?? [];

/**
 * askContext bundles all derived parameters for this turn into a single object.
 * It is passed to every abAskHelper* and abAskTool* tag so each can self-serve without needing a bespoke parameter list.
 */
const askContext: ABAskContext = {
    menuType,
    menuActionData,
    originalUserInquiry,
    originalUserInquiryLabel,
    attachments,
    abBot,
    sourceId,
    abDimension,
    abPosition,
    patchBotDimension,
    patchBotPosition,
    hasInquiry,
    model,
    callDepth,
    agentMode,
    historyStorageBot,
    storedHistory,
    todoBot,
    recordName,
};

if (callDepth === 0 && hasInquiry && agentMode === 'plan' && !todoBot) {
    await thisBot.abAskHelperCreateUserRequestTodo({ askContext });
    return;
}

const MAX_CALL_DEPTH = 5;

if (callDepth >= MAX_CALL_DEPTH) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    ab.links.utils.abLog({ name, message: 'AI call depth limit reached' });
    return;
}

if (callDepth === 0) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    ab.links.utils.abLog({ name, message: `thinking...` });
    ab.links.manifestation.abBotChat({ bot: abBot, message: `thinking...` });
}

// ── Build messages for this turn ────────────────────────────────────────

let aiChatMessages: AIChatMessage[];
const focus = thisBot.abAskHelperBuildFocusContext({ askContext });

function buildContextObj(extra: Record<string, any> = {}): Record<string, any> {
    const ctx: Record<string, any> = {};
    if (agentMode) ctx.mode = agentMode;
    if (todoBot) ctx.todoId = todoBot.id;
    ctx.focus = focus;
    return { ...ctx, ...extra };
}

function buildUserMessage(message?: string, extra: Record<string, any> = {}): string {
    const obj: Record<string, any> = { context: buildContextObj(extra) };
    if (message != null) obj.message = message;
    return JSON.stringify(obj);
}

// Attachments are appended to the new user message as AIDataContent blocks.
// They never mutate storedHistory — past attachments live inside the persisted history already.
const attachmentBlocks = attachments.map(a => ({ base64: a.base64, mimeType: a.mimeType }));

if (!hasInquiry && storedHistory.length > 0) {
    // query function continuation — history already ends with the query result user message
    aiChatMessages = storedHistory;
} else if (storedHistory.length > 0) {
    // New user message continuing an existing session
    aiChatMessages = [
        ...storedHistory,
        { role: 'user', content: [{ text: buildUserMessage(originalUserInquiry) }, ...attachmentBlocks] }
    ];
} else {
    // Fresh start — include catalog so agents can reason about available tools immediately
    const catalog = thisBot.abAskToolGetCatalog();
    aiChatMessages = [
        { role: 'system', content: [{ text: tags.prompt_system }] },
        { role: 'assistant', content: [{ text: 'Understood. I will always respond with a valid JSON array of function calls and nothing else.' }] },
        { role: 'user', content: [{ text: buildUserMessage(originalUserInquiry, { catalog }) }, ...attachmentBlocks] },
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

const functionCalls = thisBot.abAskHelperParseFunctionCalls({ response, askContext });

// ── Non-JSON response fallback ───────────────────────────────────────────

if (functionCalls === null) {
    // Response did not contain detectable function calls. Attempting to extract code from response for patch bot.
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Response did not contain detectable function calls. Attempting to extract code from response for patch bot. Response:`, response);
    }
    const extractedCode = thisBot.abAskHelperExtractCode({ response, askContext });
    await thisBot['abAskToolMakePatch']({ args: { code: extractedCode }, askContext });
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] parsed function calls:`, functionCalls);
}

// ── Dispatch function calls ─────────────────────────────────────────────
// Each abAskTool* tag is called with { args, askContext }.
// Tools that return a value are query functions — their results are injected
// into the next AI turn. Tools that return undefined are action functions.

const queryResults: { name: string; result: any }[] = [];

for (const fc of functionCalls) {
    const { name, args } = fc.function;
    const toolTagName = 'abAskTool' + name.charAt(0).toUpperCase() + name.slice(1);

    let toolHost: any = typeof thisBot[toolTagName] === 'function' ? thisBot : null;

    if (!toolHost) {
        const name = thisBot.abAskHelperGetAgentName({ askContext });
        ab.links.utils.abLog({ name, message: `Unknown function call from AI: ${name}`, logType: 'error' });
        continue;
    }

    const result = await toolHost[toolTagName]({ args, askContext });

    if (result !== undefined) {
        queryResults.push({ name, result });
    }
}

if (queryResults.length > 0) {
    const resultUserMessage = buildUserMessage(undefined, { functionResults: queryResults });

    if (historyStorageBot) {
        thisBot.abConversationHistorySave({
            historyStorageBot,
            history: [
                ...aiChatMessages,
                { role: 'assistant', content: [{ text: response }] },
                { role: 'user', content: [{ text: resultUserMessage }] },
            ]
        });
    }

    await thisBot.askGPT({
        ...askThat,
        inquiry: undefined,
        historyStorageBot,
        callDepth: callDepth + 1,
    });
} else {
    if (historyStorageBot) {
        thisBot.abConversationHistorySave({
            historyStorageBot,
            history: [
                ...aiChatMessages,
                { role: 'assistant', content: [{ text: response }] }
            ]
        });
    }
}
