const {
    dimension = configBot.tags.gridPortal ?? 'home',
    position = new Vector3(0, 0, 0),
    scale = 1,
} = that ?? {};

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

if (!links.keyboardBot) {
    const keyboardBot = create({
        space: 'tempLocal',
        form: 'keyboard',
        anchorPoint: 'center',
        controller: getLink(thisBot),
        draggable: false,
        onKeyClick: ListenerString(() => {
            links.controller.keyClick(that);
        })
    })

    masks.keyboardBot = getLink(keyboardBot);
}

links.keyboardBot.tags.dimension = dimension;
links.keyboardBot.tags[dimension] = true;
links.keyboardBot.tags[dimension + 'X'] = position.x;
links.keyboardBot.tags[dimension + 'Y'] = position.y;
links.keyboardBot.tags[dimension + 'Z'] = position.z;
links.keyboardBot.tags.scaleX = scale;
links.keyboardBot.tags.scaleY = scale;

return links.keyboardBot;