let direction = that.direction;

await os.sleep(1000);

let startPos = {
    x: tags.homeX,
    y: tags.homeY
}

if (tags.mode == "play" && tags.moveAllowed == that.uuid) {
    await thisBot.move(direction);

    let xCheck = startPos.x == tags.homeX;
    let yCheck = startPos.y == tags.homeY;

    if (xCheck && yCheck) {
        direction = direction == "left" ? "right" : "left";
        await thisBot.move(direction)
    }

    thisBot.moveLeftRight({direction: direction, uuid: that.uuid})
}

// tags.mode == "play" ? thisBot.moveLeftRight({direction: direction, uuid: that.uuid}) : null;