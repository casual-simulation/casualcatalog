if (!tags.inputSuggestionEnabled) {
    return;
}

const inputBot = that?.inputBot;
const text = that?.text;
const animate = that?.animate ?? true;

assert(inputBot, `[${tags.system}.${tagName}] inputBot is a required paramemter.`);
assert(text, `[${tags.system}.${tagName}] text is a required parameter.`);

let stopped = false;

if (animate) {
    const chars = [...text];

    for (let i = 0; i <= chars.length; i++) {
        if (inputBot.tags.stopSuggestion) {
            stopped = true;
            break;
        }
        
        await os.sleep(math.random(25, 100));
        inputBot.tags.menuItemText = chars.slice(0, i).join('');
    }
}

if (stopped) {
    inputBot.tags.menuItemText = '';
} else {
    inputBot.tags.menuItemText = text;
}