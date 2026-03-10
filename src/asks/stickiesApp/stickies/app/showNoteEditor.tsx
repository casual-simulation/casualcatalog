await os.unregisterApp('note-editor');

const App = thisBot.getNoteEditor();

await os.registerApp('note-editor', thisBot);
os.compileApp('note-editor', <App
    botId={that.id}
    label={that.tags.label}
    color={that.tags.color}
    labelColor={that.tags.labelColor ?? '#000000'}
    lineColor={that.tags.lineColor ?? '#000000'}
    lineWidth={that.tags.lineWidth ?? 4}
/>);
