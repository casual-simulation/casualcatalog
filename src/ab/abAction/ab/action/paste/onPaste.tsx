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

const newBots = await ab.links.create.abCreateBots({bots: pastedData, sourceEvent: 'paste'});
const lineToArr = [];

for (const newBotData of newBots) {
    lineToArr.push(newBotData.id);
}

//select new bots
ab.links.manifestation.links.abBot.links.armBot?.originSetSelection(lineToArr);
ab.links.manifestation.links.abBot.masks.lineTo = lineToArr;

await os.sleep(0)
if (lineToArr.length > 1) {
    ab.links.remember.masks.abMultipleBotFocus = getLink(lineToArr);
    ab.links.manifestation.abClick({ menu: 'multipleBot' });
} else {
    ab.links.remember.masks.abBotFocus = getLink(lineToArr[0]);
    ab.links.manifestation.abClick({ menu: 'bot' });
}

function replaceMacros(text) {
    if (!text) {
        return text;
    }

    for (let m of MACROS) {
        text = text.replace(m.test, m.replacement);
    }

    return text;
}