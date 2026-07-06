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
let copyBot;
try {
    copyBot = JSON.parse(formattedCopy);
} catch (e) {
    os.toast("pasted data is not valid JSON");
    return;
}

let pastedData = !copyBot.state ? {[copyBot.id]: copyBot} : copyBot.state;
let dimMod = ab.links.remember.tags.abGridFocus;

if (dimMod) {
    let firstBotData = {
        x: null,
        y: null
    };
    for (const pastedBotData in pastedData) {
        if (!firstBotData.x) {
            firstBotData.x = pastedData[pastedBotData].tags[dimMod.dimension + 'X'] ?? 0;
            firstBotData.y = pastedData[pastedBotData].tags[dimMod.dimension + 'Y'] ?? 0;
            pastedData[pastedBotData].tags[dimMod.dimension] = true;
            pastedData[pastedBotData].tags[dimMod.dimension + 'X'] = dimMod.position.x;
            pastedData[pastedBotData].tags[dimMod.dimension + 'Y'] = dimMod.position.y;
            continue;
        }

        let xOffset = 0;
        let yOffset = 0;

        xOffset = pastedData[pastedBotData].tags[dimMod.dimension + 'X'] - firstBotData.x;
        yOffset = pastedData[pastedBotData].tags[dimMod.dimension + 'Y'] - firstBotData.y;

        pastedData[pastedBotData].tags[dimMod.dimension] = true;
        pastedData[pastedBotData].tags[dimMod.dimension + 'X'] = dimMod.position.x + xOffset;
        pastedData[pastedBotData].tags[dimMod.dimension + 'Y'] = dimMod.position.y + yOffset;
    }
}

if (Object.keys(pastedData).length == 1 && dimMod)
{
    os.toast("bot added to inst");
}
else
{
    os.toast("bots added to inst");
}

const username = await ab.links.console.getUserName();

ab.log({ name: username, message: 'pasted data', space: 'shared' });

ab.links.create.abCreateBots({bots: pastedData, sourceEvent: 'paste'});

function replaceMacros(text) {
    if (!text) {
        return text;
    }

    for (let m of MACROS) {
        text = text.replace(m.test, m.replacement);
    }

    return text;
}