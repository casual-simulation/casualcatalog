const { portal, dimension } = that;

const todoInDimension = tags[dimension] == true;

if (todoInDimension) {
    await os.sleep(250);
    thisBot.refreshAnimation();
}