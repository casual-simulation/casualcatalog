class StringBuilder {
    constructor(str) {
        this.indent = 0;
        this.markers = [];
        this.str = str;
        this.loc = loc(str);
    }

    appendLine(s) {
        if (this.indent > 0) {
            this.str += indent(s, this.indent);
        } else {
            this.str += s;
        }
        this.str += '\n';
        this.loc = loc(this.str);
        return this;
    }

    append(s) {
        this.str += s;
        this.loc = loc(this.str);
        return this;
    }
}

function loc(str) {
    const lines = str.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length;
    return {
        line,
        col
    };
}

function renderTimeline(timeline, name) {
    let builder = new StringBuilder('@');
    builder.appendLine('// Note: this is a visualization of the test timeline.');
    builder.appendLine('// It does not contain working code.\n');
    builder.appendLine(`start('${name}')`);
    for(let event of timeline) {
        renderEvent(event, builder);
    }

    console.log(builder.str);
    builder.appendLine('end()');
    return {
        string: builder.str,
        markers: builder.markers
    };
}

function renderEvent(event, builder) {
    console.log('render', event);
    if (event.type === 'user_action') {
        renderUserAction(event, builder);
    } else if (event.type === 'emitted_action') {
        renderEmittedAction(event, builder);
    } else if (event.type === 'check') {
        builder.appendLine(`check: ${getFormattedJSON(event.diff)}`);
    } else if (event.type === 'update_tag') {
        renderUpdateTag(event, builder);
    } else if (event.type === 'update_tag_mask') {
        renderUpdateTagMask(event, builder);
    } else if (event.type === 'script') {
        renderScript(event, builder);
    }
}

function renderShout(event, builder) {
    builder.appendLine(`// @${event.action.eventName}`);
    if (event.action.keys.length > 0) {
        builder.appendLine(`whisper.${event.action.eventName}('${event.action.keys.join(',')}')`);
    } else {
        builder.appendLine(`shout.${event.action.eventName}()`);
    }
}

function renderEmittedAction(event, builder) {
    let prefix = '';
    if ('taskId' in event.action) {
        prefix = `\$${event.action.taskId}: `;
    }
    let { taskId, type, ...rest } = event.action;

    if (event.location) {
        builder.markers.push({
            line: builder.loc.line,
            label: 'Go to action',
            location: event.location
        });
    }

    builder.appendLine(`${prefix}${type}(${getFormattedJSON(rest)})`);
}

function renderUpdateTag(event, builder) {
    if (event.location) {
        builder.markers.push({
            line: builder.loc.line,
            label: 'Go to Tag Update',
            location: event.location
        });
    }

    builder.appendLine(`updateTag(${event.update.tag}, ${getFormattedJSON(event.update.newValue)})`);
}

function renderUpdateTagMask(event, builder) {
    if (event.location) {
        builder.markers.push({
            line: builder.loc.line,
            label: 'Go to Tag Mask Update',
            location: event.location
        });
    }

    builder.appendLine(`updateTagMask(${event.update.tag}, ${event.update.space}, ${getFormattedJSON(event.update.newValue)})`);
}

function renderScript(event, builder) {
    if (event.location) {
        builder.markers.push({
            line: builder.loc.line,
            label: 'Go to Script',
            location: event.location
        });
    }

    builder.appendLine(`run_script('${event.botId}', '${event.tag}', () => {`);
    builder.indent += 4;
    for (let e of event.timeline) {
        renderEvent(e, builder);
    }
    builder.indent -= 4;
    builder.appendLine('\n})');
}

function renderUserAction(event, builder) {
    if ('timeline' in event) {
        for (let e of event.timeline) {
            renderEvent(e, builder);
        }
    } else if (event.action.type === 'action') {
        renderShout(event, builder);
    } else if (event.action.type === 'async_result') {
        let formatted = getFormattedJSON(event.action.result);
        let commented = formatted.split('\n').map(line => `// ${line}`).join('\n');

        builder.appendLine(`${commented} -> \$${event.action.taskId}`);
    }
}

function indent(str, level) {
    let lines = str.split('\n');
    let indentString = ' '.repeat(level);
    let indented = lines.map(l => l.length > 0 ? indentString + l : l);
    return indented.join('\n');
}

const { timeline, name } = that;

return renderTimeline(timeline, name);