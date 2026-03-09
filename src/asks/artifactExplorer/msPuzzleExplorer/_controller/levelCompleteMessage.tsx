console.log("level complete message tag triggered")

let levelCompleteMessageBot = getBot(byTag("system", "gameMessage.levelComplete"));
if (!levelCompleteMessageBot) {
    let offset = await thisBot.getOffset();
    create({
        space: "shared",
        home: true,
        homeX: 0.5 + offset.x,
        homeY: 0.5 + offset.y,
        homeZ: 3,
        orientationMode: "billboard",
        label: "Level Complete!",
        labelFontSize: 3,
        timeAdded: os.isCollaborative() ? os.agreedUponTime : os.localTime,
        onClick: `@ thisBot.destroyMessage({ ignoreTime: true, restartOnDestroy: true });`,
        onCreate: `@ await os.sleep(5000); whisper(thisBot,"destroyMessage",{ ignoreTime: true, restartOnDestroy: true });`,
        destroyMessage: `@
                    let startTime = tags.timeAdded;
                    let currTime = os.isCollaborative() ? os.agreedUponTime : os.localTime;
                    let {
                        ignoreTime = false,
                        restartOnDestroy = false
                    } = that || {};

                    if(ignoreTime == true || currTime - startTime > 1500){
                        destroy(thisBot);
                        restartOnDestroy == true ? shout("restartPuzzle") : null;
                    }
                `,
        destroy: `@ destroy(thisBot);`,
        system: "gameMessage.levelComplete",
        // resetBoardCopies: `@ destroy(thisBot);`,
        scale: 8,
        scaleY: 0.5,
        scaleZ: 0.01,
    });
}

// await os.sleep(5000)