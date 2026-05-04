// Debug-only inspection helper. Produces a console-friendly clone of an
// AIChatMessage / AIChatMessage[] / raw response string. Original `text`
// fields are preserved verbatim; a sibling `_debugFormatted` is added when
// the text contains parseable JSON, so the byte-for-byte string and the
// structured view are both visible in the console.
//
// Extraction: each `text` is scanned for balanced {...} / [...] spans
// validated with JSON.parse. Successful spans become parsed segments; the
// surrounding text stays as a string. Mixed inputs like
// "prefix{...}middle[...]suffix" become alternating segments.
//
// Not part of the chat pipeline. For console.log inspection only.

function findMatchingClose(text, start) {
    const open = text[start];
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < text.length; i++) {
        const c = text[i];
        if (escape) { escape = false; continue; }
        if (c === '\\') { escape = true; continue; }
        if (c === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (c === open) depth++;
        else if (c === close) {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

// Returns undefined when no JSON was extracted (i.e. the input is plain text
// and a `_debugFormatted` view would just duplicate the original string).
function extractJsonSegments(text) {
    const segments = [];
    let buffer = '';
    let i = 0;

    while (i < text.length) {
        const c = text[i];
        if (c === '{' || c === '[') {
            const end = findMatchingClose(text, i);
            if (end !== -1) {
                const candidate = text.slice(i, end + 1);
                try {
                    const parsed = JSON.parse(candidate);
                    if (buffer) { segments.push(buffer); buffer = ''; }
                    segments.push(parsed);
                    i = end + 1;
                    continue;
                } catch (e) {}
            }
        }
        buffer += c;
        i++;
    }
    if (buffer) segments.push(buffer);

    if (segments.length <= 1 && typeof segments[0] === 'string') return undefined;
    if (segments.length === 1) return segments[0];
    return segments;
}

function format(value) {
    if (Array.isArray(value)) return value.map(format);
    if (value && typeof value === 'object') {
        const out = {};
        for (const k of Object.keys(value)) {
            const v = value[k];
            if (k === 'content' && Array.isArray(v)) {
                out[k] = v.map(format);
            } else {
                out[k] = v;
            }
        }
        if (typeof value.text === 'string') {
            const formatted = extractJsonSegments(value.text);
            if (formatted !== undefined) out._debugFormatted = formatted;
        }
        return out;
    }
    if (typeof value === 'string') {
        const formatted = extractJsonSegments(value);
        if (formatted === undefined) return value;
        return { text: value, _debugFormatted: formatted };
    }
    return value;
}

return format(that);
