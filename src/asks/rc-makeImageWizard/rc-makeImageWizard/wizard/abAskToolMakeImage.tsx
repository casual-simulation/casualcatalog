interface MakeImageArgs {
    pixels: Array<{ x: number; y: number; color: string }>;
    title?: string;
}

const { args, askContext } = that as ABAskToolCall<MakeImageArgs>;
const { abDimension, abPosition } = askContext;
const pixels = args.pixels ?? [];
const title = args.title;

for (const pixel of pixels) {
    create({
        space: 'tempLocal',
        [abDimension]: true,
        [abDimension + 'X']: abPosition.x + pixel.x,
        [abDimension + 'Y']: abPosition.y + pixel.y,
        color: pixel.color,
        scale: 0.9,
        system: 'rc-makeImageWizard.pixel',
    });
}

if (title) {
    os.toast(title);
}
