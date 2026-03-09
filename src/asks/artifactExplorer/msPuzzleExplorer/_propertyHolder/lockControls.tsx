setTagMask(thisBot, "onKeyDown", `@

    let keyDown = that.keys[0];
    let upCheck = keyDown.includes("ArrowUp") || keyDown.toLowerCase() == "w";
    let downCheck = keyDown.includes("ArrowDown") || keyDown.toLowerCase() == "s";
    let leftCheck = keyDown.includes("ArrowLeft") || keyDown.toLowerCase() == "a";
    let rightCheck = keyDown.includes("ArrowRight") || keyDown.toLowerCase() == "d";

    if(upCheck || downCheck || leftCheck || rightCheck){
        shout("destroyMessage",{ ignoreTime: false, restartOnDestroy: true });
    }

`, "shared");
setTagMask(thisBot, "onDragging", "@", "shared");