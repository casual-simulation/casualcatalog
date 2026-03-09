shout("resetCartonAB")

let ab = {};

ab.space = "tempLocal";
ab.color = abRemember.tags.abBaseColor;
ab.formOpacity = "0.33";
ab.label = abRemember.tags.abBaseLabel;
ab.labelPosition = "front";
ab.labelColor = abRemember.tags.abBaseStrokeColor;
ab.labelSize = 0.61;
ab.onClick = "@ links.manager.onABClick();";//DEFINE
ab.dimension = "home";
ab.home = true;
ab.homeX = that ? that.positionX : -85.67545020808124;//DEFINE
ab.homeY = that ? that.positionY : 42.965585585585586;//DEFINE
ab.strokeColor = abRemember.tags.abBaseStrokeColor;
ab.lineColor = abRemember.tags.abBaseStrokeColor;
ab.manager = getLink(thisBot);
ab.resetCartonAB = "@ destroy(thisBot);";
ab.animateBot = `@ const rotZ = tags.dimension + "RotationZ";
let targetScale = 0.65;

if (tags.scale <= 0.651)
{
    targetScale = 0.95;
}

await animateTag(thisBot,
{
    fromValue: {
        [rotZ]: 0,
        scale: tags.scale
    },
    toValue: {
        [rotZ]: 6.3,
        scale: targetScale
    },
    easing: {
        type: "sinusoidal",
        mode: "inout"
    },
    duration: 2
}).catch(e => {});
`;
// ab.onCreate = `@ thisBot.animateBot();

// masks.interval = setInterval(() => thisBot.animateBot(), 2000);
// `;
ab.draggable = false;
ab.scale = 0.9;
ab.system = "ab.eggCartonTemp.ab";

let abManifested = await create(ab);

masks.ab = getLink(abManifested);

return abManifested;