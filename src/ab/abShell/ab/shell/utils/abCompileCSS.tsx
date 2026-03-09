let bots = that;

bots = Array.isArray(bots) ? bots : [bots];

let css = [];

for (let bot of bots) {
    for (let key in bot.tags) {
        if (key.toLowerCase().endsWith('css')) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] found CSS key: ${key}`);
            }
            css.push(bot.tags[key]);
        }
    }
}

const compiled = css.join('\n\n');
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] compiled CSS:\n\n`, compiled);
}

return compiled;