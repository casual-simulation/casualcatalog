//shout("focus", {bot: bot, position:{x: x, y: y}});

const focusType = that.bot ? "bot" : "position";
const duration = that.duration;
const zoom = that.zoom ?? configBot.tags.mapPortal ? 2000 : 10;
const rotation = that.rotation ?? {x: 45, y: 45};
const easing = that.easing ?? {type: "linear", mode: "inout"};
const focusOptions = {
    zoom: zoom,
    rotation: rotation,
    easing: easing,
    duration: duration
};

if (focusType == "bot")
{
    await os.focusOn(that.bot, focusOptions)
}
else
{
    await os.focusOn(that.position, focusOptions);
}