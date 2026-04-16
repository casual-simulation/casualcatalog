const response = that.response;

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
