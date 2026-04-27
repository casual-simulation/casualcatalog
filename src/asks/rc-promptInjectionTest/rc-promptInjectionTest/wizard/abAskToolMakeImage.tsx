interface MakeImageArgs {
    pixels: Array<{ x: number; y: number; color: string }>;
    title?: string;
}

const { args, askContext } = that as ABAskToolCall<MakeImageArgs>;
const { abDimension, abPosition } = askContext;
const pixels = args.pixels ?? [];
const title = args.title;
const imageId = uuid();

for (const pixel of pixels) {
    create({
        space: 'tempLocal',
        [abDimension]: true,
        [abDimension + 'X']: abPosition.x + pixel.x,
        [abDimension + 'Y']: abPosition.y + pixel.y,
        color: pixel.color,
        scale: 0.9,
        imageId,
        onClearImage: ListenerString(() => {
            const { imageId } = that;

            if (tags.imageId === imageId) {
                destroy(thisBot);
            }
        })
    });
}

create({
    space: 'tempLocal',
    color: '#F44E3B',
    [abDimension]: true,
    [abDimension + 'X']: abPosition.x - 1,
    [abDimension + 'Y']: abPosition.y,
    imageId,
    label: 'destroy image',
    cursor: 'pointer',
    onClick: ListenerString(() => {
        shout('onClearImage', { imageId });
    })
})

if (title) {
    os.toast(title);
}
