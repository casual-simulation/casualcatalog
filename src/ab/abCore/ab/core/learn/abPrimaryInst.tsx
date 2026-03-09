if (configBot) {
    try {
        const url = new URL(configBot.tags.url);

        for (const [key, value] of url.searchParams) {
            if (key === 'inst' || key === 'staticInst') {
                return value;
            }
        }
    } catch {
        // Bad url.
        return null;
    }
}

return null;