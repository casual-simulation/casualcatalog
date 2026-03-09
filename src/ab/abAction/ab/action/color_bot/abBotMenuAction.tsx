const targetBot = links.remember.links.abBotFocus;

const selectedColor = await os.showInput(targetBot.tags.color, {
    type: 'color',
    title: 'pick a color'
});

if (selectedColor && targetBot.tags.color !== selectedColor) {
    targetBot.tags.color = selectedColor;
    ab.links.sound.abPlaySound({ value: 'ab/audio/paint spray.mp3' });
}
