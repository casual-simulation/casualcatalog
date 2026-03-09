if (!masks.remoteColor) {
    math.setRandomSeed(configBot.id);
    masks.remoteColor = `rgb(${math.randomInt(0, 255)}, ${math.randomInt(0, 255)}, ${math.randomInt(0, 255)})`;
}

return masks.remoteColor;