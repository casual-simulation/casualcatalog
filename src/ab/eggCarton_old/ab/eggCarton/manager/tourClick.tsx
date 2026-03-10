shout("cartonMenuReset");
shout("chatCubeReset");

if (tags.tourPoint || tags.tourPoint == 0)
{
    masks.tourPoint++;
}
else
{
    masks.tourPoint = 0;
}

if (tags.tourPoint == tags.tourArray.length)
{
    masks.tourPoint = null;

    await os.focusOn(links.ab, {
        duration: 1.5,
        rotation: {
            x: Math.PI / 3,
            y: Math.PI / 4
        },
        zoom: 3000
        }).catch(e => {return});

    const endMessage = `Tour complete!
    
    You can click here to go on the tour again.

    Otherwise, please explore the map! :)`;

    shout("showConsole");

    ab.log(endMessage);

    return;
}

const currentSite = tags.tourArray[tags.tourPoint];
const targetBot = getBot("system", currentSite.bot);
const targetMessage = currentSite.text;

await os.focusOn(targetBot, {
    duration: 1.5,
    rotation: {
        x: Math.PI / 3,
        y: Math.PI / 4
    },
    zoom: 3000
}).catch(e => {return});

shout("showConsole");

ab.log(targetMessage);

const menuButton = {};

menuButton.manager = getLink(thisBot);
menuButton.formAddress = "arrow_forward";
menuButton.label = "continue tour";
menuButton.onClick = "@ links.manager.tourClick();";

thisBot.cartonButtonCreate(menuButton);