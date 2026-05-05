if (that.tags.includes("strokeColor")) {
    if (links.strokeBot) {
        links.strokeBot.tags.color = tags.strokeColor;
    }
}

if (that.tags.includes(tags.dimension)) {
    links.strokeBot.tags[tags.dimension] = tags[tags.dimension];
}