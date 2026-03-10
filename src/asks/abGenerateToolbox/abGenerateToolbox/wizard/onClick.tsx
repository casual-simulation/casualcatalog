const {
    dimension,
} = that;

let toolboxName = await os.showInput(null, { title: 'What would you like to call this new toolbox?'});

if (!toolboxName) {
    return;
}

if (toolboxName.includes('.')) {
    const message = `Toolbox names cannot have periods in them.`;

    ab.log(`${abRemember.tags.abBuilderIdentity}: ${message}`);
    os.toast(message, 5);
    console.error(message);
}

const toolboxBot = thisBot.createToolbox({ name: toolboxName });

configBot.tags.systemPortal = 'ab.toolbox';
configBot.tags.systemPortalBot = toolboxBot.id;
configBot.tags.systemPortalTag = 'tool_array';

const message = `Created toolbox named '${toolboxName}'. You can find it easily here in the system portal under '${toolboxBot.tags.system}'. Don't forget to fill out the tool_array tag!`
ab.log(`${abRemember.tags.abBuilderIdentity}: ${message}`);
os.toast(message, 8);
console.log(message);

if (tags.destroyAfterUse) {
    destroy([ thisBot, links.template ]);
}