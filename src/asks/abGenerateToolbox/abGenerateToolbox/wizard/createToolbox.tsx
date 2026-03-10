const { 
    name = 'blank toolbox'
} = that;

const toolboxMod = {
    space: 'shared',
    [name]: true,
    system: `ab.toolbox.${name}`,
};

// All other tags for the new toolbox come from the template bot's tags that are prefixed with "template_".
for (let tag in links.template.tags) {
    if (tag.startsWith('template_')) {
        const realTag = tag.substring('template_'.length);
        toolboxMod[realTag] = links.template.raw[tag];
    }
}

const toolboxBot = create(toolboxMod);
toolboxBot.tags.creator = null;

return toolboxBot;