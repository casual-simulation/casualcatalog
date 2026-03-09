thisBot.initializeMath();

globalThis.transform = {};

transform.getBotPosition = (bot, dimension) => {
    return {
        x: bot.tags[`${dimension}X`],
        y: bot.tags[`${dimension}Y`],
        z: bot.tags[`${dimension}Z`],
    }
}

transform.setBotPosition = (bot, dimension, position) => {
    bot.tags[`${dimension}X`] = position.x;
    bot.tags[`${dimension}Y`] = position.y;
    bot.tags[`${dimension}Z`] = position.z;
}

transform.getBotRotation = (bot, dimension) => {
    const rotation = bot.tags[`${dimension}Rotation`];
    if (rotation) {
        return rotation;
    } else {
        return {
            x: bot.tags[`${dimension}RotationX`],
            y: bot.tags[`${dimension}RotationY`],
            z: bot.tags[`${dimension}RotationZ`],
        }
    }
}

transform.setBotRotation = (bot, dimension, rotation) => {
    if (rotation.quaternion) {
        bot.tags[`${dimension}Rotation`] = rotation;
        delete bot.tags[`${dimension}RotationX`];
        delete bot.tags[`${dimension}RotationY`];
        delete bot.tags[`${dimension}RotationZ`];
    } else {
        bot.tags[`${dimension}RotationX`] = rotation.x;
        bot.tags[`${dimension}RotationY`] = rotation.y;
        bot.tags[`${dimension}RotationZ`] = rotation.z;
    }
}

transform.getBotScale = (bot) => {
    return {
        x: bot.tags[`scaleX`],
        y: bot.tags[`scaleY`],
        z: bot.tags[`scaleZ`],
    }
}

transform.setBotScale = (bot, scale) => {
    bot.tags[`scaleX`] = scale.x;
    bot.tags[`scaleY`] = scale.y;
    bot.tags[`scaleZ`] = scale.z;
}

transform.lookAtPoint = (eyeBot, eyeBotDimension, point) => {
    const targetPos = {...point};
    const eyePos = transform.getBotPosition(eyeBot, eyeBotDimension);
    
    const direction = math.subtractVectors(targetPos, eyePos);

    const lookRotation = new Rotation({
        direction,
        upwards: new Vector3(0, 0, 1),
        errorHandling: 'nudge',
    })

    transform.setBotRotation(eyeBot, eyeBotDimension, lookRotation);
}

transform.lookAtBot = ( eyeBot, eyeBotDimension, targetBot, targetDimension ) => {
    const targetPos = transform.getBotPosition( targetBot, targetDimension );
    transform.lookAtPoint(eyeBot, eyeBotDimension, targetPos);
}