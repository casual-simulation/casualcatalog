if (!builderVersion)
{
    return;
}

const MACROS = [
    {
        test: /(?:[“”])/g,
        replacement: (val) => '"',
    },
    {
        test: /(?:[‘’])/g,
        replacement: (val) => "'",
    },
];

let formattedCopy = replaceMacros(that.text);
let copyBot = JSON.parse(formattedCopy);
let pastedData = !copyBot.state ? {[copyBot.id]: copyBot} : copyBot.state;
let dimMod = links.remember.tags.abFocusData;

if (Object.keys(pastedData).length == 1 && dimMod)
{
    pastedData[dimMod.dimension] = true;
    pastedData[dimMod.dimension+"X"] = dimMod.x;
    pastedData[dimMod.dimension+"Y"] = dimMod.y;

    os.toast("bot added to inst");
}
else
{
    os.toast("bots added to inst");
}

ab.log(links.personality.tags.abBuilderIdentity + ": pasted data");

links.create.abCreateBots({bots: pastedData, sourceEvent: 'paste'});

function replaceMacros(text) {
    if (!text) {
        return text;
    }

    for (let m of MACROS) {
        text = text.replace(m.test, m.replacement);
    }

    return text;
}