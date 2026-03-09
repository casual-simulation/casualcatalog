if (!links.remember.tags.abRightClickDisabled && !that.bot.tags.abRightClickIgnore && that.modality == "mouse" && that.buttonId == "right") {
    if (!tags.abAwake) {
        return;
    }

    // ab selected
    if (that.bot == links.abBot) {
        links.menu.abEnvironmentMenu();
        return;
    }    
    
    const armBot = ab.links.arm_tool.abCreateArm({
        originBot: links.abBot,
        dimension: that.dimension,
        position: that.position,
    })

    const botPosition = getBotPosition(that.bot, that.dimension);

    // Fake user dropping the selecting the bot with the arm.
    armBot.onDrop({
        bot: armBot,
        to: {
            bot: that.bot,
            x: botPosition.x,
            y: botPosition.y,
            z: botPosition.z,
            dimension: that.dimension
        },
        from: {
            x: botPosition.x,
            y: botPosition.y,
            z: botPosition.z,
            dimension: that.dimension
        }
    });

    return;
}