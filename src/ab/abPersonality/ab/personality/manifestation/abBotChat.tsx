if (!links.abBot && !that.bot)
{
    return;
}

const botBase = that.bot ? that.bot: links.abBot;
const dimension = !that.bot ? botBase.tags.dimension : that.dimension ? that.dimension : configBot.tags.gridPortal;
const message = that.message;
const messageTime = that.time ? that.time * 1000 : 1600; 

const messageBot = await links.bot_factory.abCreateBillboardLabel({
    bot: botBase,
    label: message,
    dimension,
    messageTime,
    color: "#000000",
    labelColor: "#ffffff",
    onBotAdded: `@
        await os.sleep(tags.messageTime);
        thisBot.onFade();
    `,
    onFade: `@
        animateTag(thisBot, {
            fromValue: {
                formOpacity: 1,
                labelOpacity: 1,
                [tags.dimension + "Z"]: tags[tags.dimension + "Z"]
            },
            toValue: {
                formOpacity: 0,
                labelOpacity: 0,
                [tags.dimension + "Z"]: tags[tags.dimension + "Z"] + 5
            },
            duration: ${that.duration ?? 3}
        })
        .catch((e) => {})
        .finally(() => {
            destroy(thisBot);
        })

    `,
});