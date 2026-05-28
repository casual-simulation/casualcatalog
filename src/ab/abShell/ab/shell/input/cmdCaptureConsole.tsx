const args = that;
const mode = args && args.length > 0 ? String(args[0]).toLowerCase() : undefined;

const CONSOLE_METHODS = ['log', 'info', 'warn', 'error', 'debug'];

const nowString = () => {
    try {
        const t = os.isCollaborative() ? os.agreedUponTime : os.localTime;
        return new Date(t).toTimeString().slice(0, 8);
    } catch (e) {
        return '';
    }
};

// Drop stack-trace frames ("    at ...") so shared output stays readable.
const stripStack = (text) => text
    .split('\n')
    .filter(line => !/^\s*at\s/.test(line))
    .join('\n')
    .trim();

const simplifyArg = (arg) => {
    if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}`;
    }
    if (typeof arg === 'string') {
        return stripStack(arg);
    }
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
        try {
            return JSON.stringify(arg);
        } catch (e) {
            return String(arg);
        }
    }
    return String(arg);
};

const startCapture = () => {
    const existing = thisBot.vars.captureConsole;
    if (existing && existing.active) {
        os.toast('Console capture is already running. Use ".captureconsole stop" to view it.');
        return;
    }

    const buffer = [];
    const originals = {};

    const record = (level, callArgs) => {
        try {
            const text = Array.from(callArgs).map(simplifyArg).join(' ');
            buffer.push(`[${nowString()}] ${level.toUpperCase()}: ${text}`);
        } catch (e) {}
    };

    for (const method of CONSOLE_METHODS) {
        originals[method] = console[method];
        console[method] = function (...callArgs) {
            record(method, callArgs);
            return originals[method].apply(console, callArgs);
        };
    }

    let errorHandler;
    let rejectionHandler;
    if (typeof globalThis !== 'undefined' && globalThis.document?.addEventListener) {
        errorHandler = (event) => {
            const message = event && (event.message || (event.error && (event.error.message || String(event.error))));
            buffer.push(`[${nowString()}] UNCAUGHT: ${stripStack(String(message || 'Unknown error'))}`);
        };
        rejectionHandler = (event) => {
            const reason = event && event.reason;
            let message;
            if (reason instanceof Error) message = `${reason.name}: ${reason.message}`;
            else if (typeof reason === 'string') message = reason;
            else { try { message = JSON.stringify(reason); } catch (e) { message = String(reason); } }
            buffer.push(`[${nowString()}] UNHANDLED REJECTION: ${stripStack(String(message))}`);
        };
        globalThis.document.addEventListener('error', errorHandler);
        globalThis.document.addEventListener('unhandledrejection', rejectionHandler);
    }

    thisBot.vars.captureConsole = { active: true, buffer, originals, errorHandler, rejectionHandler };
    os.toast('Console capture started.');
};

const APP_ID = 'ab-capture-console';

const stopCapture = async () => {
    const state = thisBot.vars.captureConsole;
    if (!state || !state.active) {
        os.toast('Console capture is not running. Use ".captureconsole start" first.');
        return;
    }

    for (const method of CONSOLE_METHODS) {
        if (state.originals[method]) console[method] = state.originals[method];
    }
    if (state.errorHandler && typeof globalThis !== 'undefined' && globalThis.document?.removeEventListener) {
        globalThis.document.removeEventListener('error', state.errorHandler);
        globalThis.document.removeEventListener('unhandledrejection', state.rejectionHandler);
    }
    state.active = false;

    const entryCount = state.buffer.length;
    const traceText = entryCount > 0 ? state.buffer.join('\n') : '(no console output captured)';

    const classifyLine = (entry) => {
        const match = /^\[[^\]]*\]\s+([A-Z ]+):/.exec(entry);
        const level = match ? match[1].trim() : '';
        if (level === 'ERROR' || level === 'UNCAUGHT' || level === 'UNHANDLED REJECTION') return 'cc-error';
        if (level === 'WARN') return 'cc-warn';
        return '';
    };

    const lines = (entryCount > 0 ? state.buffer : [traceText]).map(entry => ({ text: entry, cls: classifyLine(entry) }));

    const styleCss = `
        #cc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 10; }
        .cc-window { display: flex; flex-direction: column; width: min(90vw, 900px); max-height: 85vh; background: #1e1e1e; color: #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        .cc-bar { display: flex; gap: 0.75rem; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #333; }
        .cc-btn { background: #2d6cdf; color: #fff; border: none; border-radius: 4px; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.9rem; }
        .cc-btn:hover { background: #3a7bef; }
        .cc-close { background: #444; }
        .cc-close:hover { background: #555; }
        .cc-count { margin-left: auto; color: #888; font-size: 0.8rem; }
        .cc-trace { margin: 0; padding: 1rem; overflow: auto; font-size: 0.8rem; line-height: 1.45; }
        .cc-line { white-space: pre-wrap; word-break: break-word; color: #ddd; }
        .cc-warn { color: #ffcc66; }
        .cc-error { color: #ff6b6b; }
    `;

    const App = () => {
        const { useState } = os.appHooks;
        const [copied, setCopied] = useState(false);

        const onCopy = () => {
            os.setClipboard(traceText);
            setCopied(true);
        };

        const onClose = () => {
            os.compileApp(APP_ID, <></>);
            os.unregisterApp(APP_ID);
        };

        return (
            <>
                <style>{styleCss}</style>
                <div id="cc-overlay" onClick={(e) => { if (e.target.id === 'cc-overlay') onClose(); }}>
                    <div className="cc-window">
                        <div className="cc-bar">
                            <button className="cc-btn" onClick={onCopy}>{copied ? 'Copied!' : 'Copy to clipboard'}</button>
                            <button className="cc-btn cc-close" onClick={onClose}>Close</button>
                            <span className="cc-count">{entryCount} {entryCount === 1 ? 'entry' : 'entries'}</span>
                        </div>
                        <div className="cc-trace">
                            {lines.map((line, i) => (
                                <div key={i} className={`cc-line ${line.cls}`}>{line.text}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    await os.unregisterApp(APP_ID);
    await os.registerApp(APP_ID, thisBot);
    os.compileApp(APP_ID, <App />);
};

if (mode === 'start') {
    startCapture();
} else if (mode === 'stop') {
    await stopCapture();
} else {
    os.toast('Usage: .captureconsole start | stop');
}
