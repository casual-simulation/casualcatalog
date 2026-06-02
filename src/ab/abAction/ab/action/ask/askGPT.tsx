"-energy"

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
const originalUserInquiryLabel = askThat.inquiryLabel ?? (originalUserInquiry.length > 40 ? originalUserInquiry.slice(0, 40) + '...' : originalUserInquiry);
const abBot = askThat.abBot ? getBot('id', askThat.abBot) : ab.links.manifestation.links.abBot;
const sourceId = askThat.sourceId ?? uuid();
const abDimension = askThat.abDimension ?? ab.links.remember.tags.abActiveDimension;
const abPosition = askThat.abPosition ?? ab.links.remember.tags[abDimension + 'ABLastPosition'];
const patchBotDimension = askThat.abDimension ?? ab.links.remember.tags.abActiveDimension;
const patchBotPosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 2 };
const hasInquiry = askThat.inquiry != null;
const model = askThat.model;
const useStreaming: boolean = askThat.useStreaming ?? tags.abChatStreaming;
const onPartialResponse = askThat.onPartialResponse;
const callDepth: number = askThat.callDepth ?? 0;
const todoBot = askThat.todoBot ? getBot('id', askThat.todoBot) : undefined;
const agentMode: string = todoBot?.tags.agentMode ?? askThat.agentMode ?? 'build';
const historyStorageBot = askThat.historyStorageBot ? getBot('id', askThat.historyStorageBot) : undefined;
const storedHistory: AIChatMessage[] = historyStorageBot ? thisBot.abConversationHistoryGet({ historyStorageBot }) : [];
const recordName: string | undefined = askThat.recordName ?? todoBot?.tags.budgetRecordName ?? authBot.id;
const menuType = askThat.menuType;
const menuActionData = askThat.menuActionData;
const attachments: ABAttachment[] = askThat.attachments ?? [];
const userInitiated: boolean = askThat.userInitiated ?? false;

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
    useStreaming,
    onPartialResponse,
    userInitiated,
};

function buildUserMessage(message?: string, extra: Record<string, any> = {}): string {
    return thisBot.abAskHelperBuildUserMessage({ askContext, message, extra });
}

if (callDepth === 0 && hasInquiry && agentMode === 'plan' && !todoBot) {
    const createdTodo = await thisBot.abAskHelperCreateUserRequestTodo({ askContext });

    if (createdTodo) {
        const agentName = thisBot.abAskHelperGetAgentName({ askContext });
        const agentAvatar = thisBot.abAskHelperGetAgentAvatar({ askContext });
        const username = await ab.links.console.getUserName();
        ab.links.utils.abLog({ name: agentName, avatar: agentAvatar, message: `${username} created a user request todo for "${originalUserInquiryLabel}"`, space: 'shared' });
    }

    return;
}

const MAX_CALL_DEPTH = 10; // Prevent infinite loops — if the agent calls askGPT recursively too many times, we stop and log an error.

if (callDepth >= MAX_CALL_DEPTH) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    const avatar = thisBot.abAskHelperGetAgentAvatar({ askContext });
    ab.links.utils.abLog({ name, avatar, message: 'AI call depth limit reached', logType: 'error', space: 'local' });
    return;
}

if (callDepth === 0) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    const avatar = thisBot.abAskHelperGetAgentAvatar({ askContext });
    ab.links.utils.abLog({ name, avatar, message: `thinking...`, space: 'local' });
    ab.links.manifestation.abBotChat({ bot: abBot, message: `thinking...` });
}

// ── Build messages for this turn ────────────────────────────────────────

let aiChatMessages: AIChatMessage[];

// Attachments are appended to the new user message as AIDataContent blocks.
// They never mutate storedHistory — past attachments live inside the persisted history already.
const attachmentBlocks = attachments.map(a => ({ base64: a.base64, mimeType: a.mimeType }));

if (!hasInquiry && storedHistory.length > 0) {
    // query function continuation — history already ends with the query result user message
    aiChatMessages = storedHistory;
} else if (storedHistory.length > 0) {
    const lastStored = storedHistory[storedHistory.length - 1];
    if (lastStored?.role === 'user') {
        // History already ends with a pending user message (e.g. an askUser function-result
        // resume injected by userAskTodoSubmit). Use history as-is and ignore the new inquiry —
        // this is what lets the manager-driven resume work even though agentOnRequest passes
        // the parent todo's prompt as the inquiry.
        aiChatMessages = storedHistory;
    } else {
        // New user message continuing an existing session
        aiChatMessages = [
            ...storedHistory,
            { role: 'user', content: [{ text: buildUserMessage(originalUserInquiry) }, ...attachmentBlocks] }
        ];
    }
} else {
    // Fresh start — include catalog so agents can reason about available tools immediately.
    // abAskToolGetCatalog auto-spawns a user-studio catalog when the grid is empty, so this
    // may block briefly on artifact reconstitution on the very first turn.
    const catalog = await thisBot.abAskToolGetCatalog({ askContext });

    // Replace the {{personalization_prompt}} placeholder in the system prompt with the user's
    // personalization prompt (if any), prefixed with a header. When unset/empty the placeholder
    // is removed entirely.
    // split/join (not String.replace) so $-sequences in the user's prompt aren't interpreted.
    const rawPersonalizationPrompt = ab.links.personality?.tags.abPersonalizationPrompt;
    const personalizationPrompt = rawPersonalizationPrompt ? `# User Personalization\n\n${rawPersonalizationPrompt}` : '';
    const systemPrompt = tags.prompt_system.split('{{personalization_prompt}}').join(personalizationPrompt);

    aiChatMessages = [
        { role: 'system', content: [{ text: systemPrompt }] },
        { role: 'assistant', content: [{ text: 'Understood. I will always respond with a valid JSON array of function calls and nothing else.' }] },
        { role: 'user', content: [{ text: buildUserMessage(originalUserInquiry, { catalog }) }, ...attachmentBlocks] },
    ];
}

// ── Call AI ─────────────────────────────────────────────────────────────

let response;
let requestErrorMsg;

try {
    response = await thisBot.submitRequestGPT({ messages: aiChatMessages, model, recordName, sourceId, useStreaming, onPartialResponse });
} catch (e) {
    requestErrorMsg = ab.links.utils.getErrorMessage(e);
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

// ── Empty array response ────────────────────────────────────────────────
// An explicit "[]" means the AI parsed the format but returned no operations.
// Without this guard the dispatch loop runs zero times and the function returns
// silently — leaving any in-progress todoBot stuck in its working state.

if (functionCalls.length === 0) {
    if (todoBot) {
        todoBot.tags.animationState = 'error';
        todoBot.tags.abPatchError = 'AI returned an empty function call array';
    }
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    const avatar = thisBot.abAskHelperGetAgentAvatar({ askContext });
    ab.links.utils.abLog({ name, avatar, message: 'AI returned an empty function call array', logType: 'error', space: 'local' });
    return;
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
        const avatar = thisBot.abAskHelperGetAgentAvatar({ askContext });
        ab.links.utils.abLog({ name, avatar, message: `Unknown function call from AI: ${name}`, logType: 'error', space: 'local' });
        continue;
    }
    
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] dispatching tool '${toolTagName}' with args:`, self.structuredClone(args));
    }

    const result = await toolHost[toolTagName]({ args, askContext });

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] tool '${toolTagName}' returned:`, result);
    }

    if (result !== undefined) {
        queryResults.push({ name, result });
    }
}

const todoCompletedThisTurn = functionCalls.some(fc => fc.function?.name === 'completeTodo');

if (queryResults.length > 0) {
    const resultUserMessage = buildUserMessage(undefined, { functionResults: queryResults });

    if (historyStorageBot) {
        // Only persist the function-result user message when we're going to recurse and
        // actually consume it. If the todo completed this turn we return without recursing,
        // so appending it would leave history ending on a user message — which the next
        // todo's askGPT treats as an askUser resume and uses to discard that todo's inquiry,
        // silently skipping its work.
        const history: AIChatMessage[] = [
            ...aiChatMessages,
            { role: 'assistant', content: [{ text: response }] },
        ];
        if (!todoCompletedThisTurn) {
            history.push({ role: 'user', content: [{ text: resultUserMessage }] });
        }
        thisBot.abConversationHistorySave({ historyStorageBot, history });
    }

    // If the agent already declared the todo done in this same response, do not recurse.
    if (todoCompletedThisTurn) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] skipping recursive askGPT because completeTodo was emitted this turn`);
        }
        return;
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
