// Accept an array of bots with tags that end with 'css' and creates a single string
// that contains all the CSS
var bots = that;

bots = Array.isArray(bots) ? bots : [bots];

let css = [];

for (let bot of bots) {
    for (let key in bot.tags) {
        if (key.toLowerCase().endsWith('.css')) {
            if (tags.debug) {
                console.log(`[compileCSS] found CSS key: ${key}`);
            }
            css.push(bot.tags[key]);
        }
    }
}

const compiled = css.join('\n\n');

return compiled;
