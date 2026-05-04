let abCommands: ABCommandsManager = that;

abCommands.addCommand('printconversationhistory', (args) => {
    let historyStorageBot = ab.links.remember;
    let source = 'ab.remember';

    if (args && args.length > 0) {
        const botId = args[0];
        const bot = getBot('id', botId);
        if (!bot) {
            ab.links.utils.abLogAndToast({ message: `.printconversationhistory — no bot found with id ${botId}`, logType: 'error' });
            return;
        }
        historyStorageBot = bot;
        source = botId;
    }

    const history = historyStorageBot.tags.abConversationHistory ?? [];
    console.log(`[${tags.system}.${tagName}] conversation history (${source}):`, ab.links.utils.abDebugFormatChatMessages(history));
}, {
    shortDescription: 'Log the conversation history stored on the ab remember bot, or on a specified bot.',
    longDescription: `Log the conversation history stored on the ab remember bot by default. If a bot id is provided, the command will look up the abConversationHistory tag on that bot and log it instead.`,
    usage: [
        '.printconversationhistory',
        '.printconversationhistory <botId>'
    ]
});

abCommands.addCommand('showconversationhistory', (args) => {
    let historyStorageBot = ab.links.remember;
    let source = 'ab.remember';

    if (args && args.length > 0) {
        const botId = args[0];
        const bot = getBot('id', botId);
        if (!bot) {
            ab.links.utils.abLogAndToast({ message: `.showconversationhistory — no bot found with id ${botId}`, logType: 'error' });
            return;
        }
        historyStorageBot = bot;
        source = botId;
    }

    const history: AIChatMessage[] = historyStorageBot.tags.abConversationHistory ?? [];

    const escapeHtml = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    // If the entire text parses as a JSON object/array, pretty-print it.
    // Otherwise show the raw text. No segment extraction, no heuristics.
    const renderText = (raw) => {
        try {
            const parsed = JSON.parse(raw);
            if (parsed !== null && typeof parsed === 'object') {
                return `<pre class="json">${escapeHtml(JSON.stringify(parsed, null, 2))}</pre>`;
            }
        } catch (e) {}
        return `<pre class="text">${escapeHtml(raw)}</pre>`;
    };

    const renderBlock = (block) => {
        if (block && typeof block.text === 'string') {
            return `<div class="block">${renderText(block.text)}</div>`;
        }
        const summary = { ...block };
        if (typeof summary.base64 === 'string') summary.base64 = `<${summary.base64.length} chars>`;
        return `<div class="block"><pre class="json">${escapeHtml(JSON.stringify(summary, null, 2))}</pre></div>`;
    };

    const renderMessage = (msg, i) => {
        const role = escapeHtml(msg.role ?? 'unknown');
        const blocks = Array.isArray(msg.content) ? msg.content.map(renderBlock).join('') : renderBlock(msg.content);
        return `<div class="message role-${role}">
            <div class="header"><span class="index">#${i}</span><span class="role">${role}</span></div>
            ${blocks}
        </div>`;
    };

    const messagesHtml = history.map(renderMessage).join('');

    const html = `<style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 1rem; background: #1e1e1e; color: #ddd; }
        .meta { color: #888; font-size: 0.85rem; margin-bottom: 1rem; }
        .message { border: 1px solid #333; border-radius: 6px; margin-bottom: 0.75rem; padding: 0.5rem 0.75rem; background: #252525; }
        .message.role-system { border-left: 3px solid #6b8eff; }
        .message.role-assistant { border-left: 3px solid #6bcf7f; }
        .message.role-user { border-left: 3px solid #ffaa44; }
        .header { display: flex; gap: 0.75rem; margin-bottom: 0.5rem; align-items: baseline; }
        .index { color: #666; font-size: 0.8rem; font-family: monospace; }
        .role { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: #aaa; font-weight: 600; }
        .block { margin-top: 0.4rem; }
        .text, .json { background: #1a1a1a; padding: 0.5rem; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, monospace; font-size: 0.85rem; margin: 0.25rem 0; }
        .json { color: #b8d4ff; }
        .text { color: #ddd; }
    </style>
    <div class="meta">conversation history — ${escapeHtml(source)} — ${history.length} messages</div>
    ${messagesHtml || '<div class="meta">(empty)</div>'}`;

    os.showHtml(html);
}, {
    shortDescription: 'Open a window showing the conversation history pretty-printed for inspection.',
    longDescription: `Open a window showing the conversation history pretty-printed for inspection. Renders the conversation history stored on the ab remember bot by default. If a bot id is provided, the command will look up the abConversationHistory tag on that bot and render that instead. Each message is rendered as a card with its role, and JSON-encoded text blocks are pretty-printed inline alongside any surrounding plain text.`,
    usage: [
        '.showconversationhistory',
        '.showconversationhistory <botId>'
    ]
});
