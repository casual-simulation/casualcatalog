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

sanitizeBotReferences(that.obj);
