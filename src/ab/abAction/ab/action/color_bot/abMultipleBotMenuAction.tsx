const allTargetBots = ab.links.remember.links.abMultipleBotFocus;
const builder = ab.links.manifestation.links.abBot ? ab.links.manifestation.links.abBot.id : null;
const relevantTargetBots = allTargetBots.filter((target) => target.id != builder);

const selectedColor = await os.showInput(null, {
    type: 'color',
    title: 'pick a color'
});

if (selectedColor) {
    setTag(relevantTargetBots, "color", selectedColor);

    ab.links.sound.abPlaySound({ value: 'ab/audio/paint spray.mp3' });
}