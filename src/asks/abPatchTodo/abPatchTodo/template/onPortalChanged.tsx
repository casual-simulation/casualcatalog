const { portal, dimension } = that;

const todoInDimension = tags[dimension] == true;

if (todoInDimension) {
    thisBot.refreshAnimation();
}