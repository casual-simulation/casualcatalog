shout("reset");

const positionX = that?.position.x ?? 0;
const positionY = that?.position.y ?? 0;
const dimension = that?.dimension ?? "home";
const gridScale = that?.scale ?? 5;
const momentCount = 0;
const gridBot = {};

gridBot.space = "tempLocal";
gridBot.color = "clear";
gridBot.strokeColor = abPersonality.tags.abBaseStrokeColor;
gridBot.scale = 0.001;
gridBot.scaleZ = 0.1;
gridBot.reset = "@ destroy(thisBot);";
gridBot[dimension] = true;
gridBot.pointable = false;
gridBot.killTimer = "@ await os.sleep(400); destroy(thisBot);";

let roundBots;

for (let i = gridScale; i > 0; i--)
{
    const botCount = i * 8;

    let sideCount = 0;
    let phaseFactor = 0;

    for (let j = 0; j < botCount; j++)
    {
        if (phaseFactor == 0)
        {
            gridBot[dimension + "X"] = ((i + positionX) * -1) + sideCount;
            gridBot[dimension + "Y"] = i + positionY;
        }
        else if (phaseFactor == 1)
        {
            gridBot[dimension + "X"] = i + positionX;
            gridBot[dimension + "Y"] = (i + positionY) - sideCount;  
        }
        else if (phaseFactor == 2)
        {
            gridBot[dimension + "X"] = (i + positionX) - sideCount;
            gridBot[dimension + "Y"] = ((i + positionY) * -1) ;
        }
        else
        {
            gridBot[dimension + "X"] = ((i + positionX) * -1) ;
            gridBot[dimension + "Y"] = ((i + positionY) * -1) + sideCount;  
        }

        const newGridBot = await create(gridBot);

        animateTag(newGridBot, "scale", {
            toValue: 1,
            easing: {
                type: "elastic",
                mode: "out"
            },
            duration: 0.01
        }).catch(() => {});

        newGridBot.killTimer();

        sideCount++;

        if (sideCount == botCount / 4)
        {
            sideCount = 0;

            phaseFactor++;
        }

        await os.sleep(8);
    }
}