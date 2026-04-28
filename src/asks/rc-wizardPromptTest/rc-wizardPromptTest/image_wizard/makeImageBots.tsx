interface MakeImageArgs {
    dimension: string;
    position: { x: number, y: number };
    pixels: Array<{ x: number; y: number; color: string }>;
    title?: string;
}

const { dimension, position, pixels, title } = that as MakeImageArgs;

const imageId = uuid();

for (const pixel of pixels) {
    create({
        space: 'tempLocal',
        [dimension]: true,
        [dimension + 'X']: position.x + pixel.x,
        [dimension + 'Y']: position.y + pixel.y,
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
    [dimension]: true,
    [dimension + 'X']: position.x - 1,
    [dimension + 'Y']: position.y,
    imageId,
    label: 'destroy image',
    cursor: 'pointer',
    onClick: ListenerString(() => {
        shout('onClearImage', { imageId: tags.imageId });
        destroy(thisBot);
    })
})

if (title) {
    os.toast(title);
}
