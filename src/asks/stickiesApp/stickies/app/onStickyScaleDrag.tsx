
os.enableCustomDragging();

let parent = getBot("id", bot.tags.stickyHighlightID);

const dim = thisBot.vars.dimension;
let deltaX = that.to.x - thisBot.vars.dragStart.x;
let deltaY = that.to.y - thisBot.vars.dragStart.y;

let isSnapping = true;

let selBots = getBots("selected", true);

if(selBots.length == 1){

// adjust for changes to BOTTOM LEFT scale node
    if(bot.tags.stickyNodeID == 0){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.45;
            deltaY -= 0.55;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x - deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y - deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;

        // adjust other nodes to match changes
    }
    // adjust for changes to BOTTOM RIGHT scale node
    else if(bot.tags.stickyNodeID == 1){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.55;
            deltaY -= 0.55;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x + deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y - deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;

        // adjust other nodes to match changes
    }
    // adjust for changes to TOP RIGHT scale node
    else if(bot.tags.stickyNodeID == 2){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.55;
            deltaY -= 0.45;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x + deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y + deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;

        // adjust other nodes to match changes
    }
    // adjust for changes to TOP LEFT scale node
    else if(bot.tags.stickyNodeID == 3){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.45;
            deltaY -= 0.45;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x - deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y + deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;
    }


    // set the sticky note to matche the hightlight scale
    let stickyBot = getBot("id", parent.tags.selectedBot);

    stickyBot.tags.scaleX = parent.tags.scaleX - 0.2;
    stickyBot.tags[`${dim}X`] = parent.tags[`${dim}X`];

    stickyBot.tags.scaleY = parent.tags.scaleY - 0.2;
    stickyBot.tags[`${dim}Y`] = parent.tags[`${dim}Y`];



    // whisper(bot, "onUpdateNodePositions");

    // adjust other nodes to match changes
    let scaleBots = getBots(byTag("botID", "stickyScaleNode"), byTag("stickyBotID", bot.tags.stickyBotID));
    let arrowBots = getBots(byTag("botID", "stickyArrowNode"), byTag("stickyBotID", bot.tags.stickyBotID));

    // console.log("dragging still, ", nodeBots);
    for(let i = 0; i < scaleBots.length; i++){
        let id = scaleBots[i].tags.stickyNodeID;
        // console.log("1dddddddddddd: ", id);
        // let test = true;
        if(bot.tags.stickyNodeID != id){
            // console.log("2dddddddddddd: ", id);
            let x = 0;
            let y = 0;

            if(id < 4){
                if(id == 0){
                    x = -parent.tags.scaleX/2;
                    y = -parent.tags.scaleY/2;
                }
                else if(id == 1){
                    x = parent.tags.scaleX/2;
                    y = -parent.tags.scaleY/2;
                }
                else if(id == 2){
                    x = parent.tags.scaleX/2;
                    y = parent.tags.scaleY/2;
                }
                else if(id == 3){
                    x = -parent.tags.scaleX/2;
                    y = parent.tags.scaleY/2;
                }
            
                scaleBots[i].tags[`${dim}X`] = parent.tags[`${dim}X`] + x;
                scaleBots[i].tags[`${dim}Y`] = parent.tags[`${dim}Y`] + y;
            }    
        }
    }

    for(let i = 0; i < arrowBots.length; i++){
        let id = arrowBots[i].tags.stickyNodeID;
        // console.log("1dddddddddddd: ", id);

        let arrowOffset = 0.25;

        let stickyBot = getBot("id", arrowBots[i].tags.stickyBotID);

        let test = true;
        if(bot.tags.stickyNodeID != id){
            // console.log("2dddddddddddd: ", id);
            let x = 0;
            let y = 0;

            let arrowOffset = 0.25;

            if(id == "N"){
                x = 0;
                y = stickyBot.tags.scaleY/2 + arrowOffset;
            }
            else if(id == "E"){
                x = stickyBot.tags.scaleX/2 + arrowOffset;
                y = 0;
            }
            else if(id == "S"){
                x = 0;
                y = -stickyBot.tags.scaleY/2 - arrowOffset;
            }
            else if(id == "W"){
                x = -stickyBot.tags.scaleX/2 - arrowOffset;
                y = 0;
            }

            // set the nodes to be the cardinal arrow making nodes
            arrowBots[i].tags[`${dim}X`] = stickyBot.tags[`${dim}X`] + x;
            arrowBots[i].tags[`${dim}Y`] = stickyBot.tags[`${dim}Y`] + y;
        }
    }

}
else{

    selBots = thisBot.vars.selectedSticky;
    if(bot.tags.stickyNodeID == 0){
        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.45;
            deltaY -= 0.55;
        }

        // move the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x - deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y - deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;


        for(let i = 0; i < selBots.length; i++){
            let selectedBot = selBots[i];

            selectedBot.tags.scaleX = thisBot.vars.selectScaleStart[i].x - deltaX;
            selectedBot.tags[`${dim}X`] = thisBot.vars.selectPosStart[i].x + deltaX/2;

            selectedBot.tags.scaleY = thisBot.vars.selectScaleStart[i].y - deltaY;
            selectedBot.tags[`${dim}Y`] = thisBot.vars.selectPosStart[i].y + deltaY/2;
        }

        // adjust other nodes to match changes
    }
    // adjust for changes to BOTTOM RIGHT scale node
    else if(bot.tags.stickyNodeID == 1){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.55;
            deltaY -= 0.55;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x + deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y - deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;


        for(let i = 0; i < selBots.length; i++){
            let selectedBot = selBots[i];

            selectedBot.tags.scaleX = thisBot.vars.selectScaleStart[i].x + deltaX;
            selectedBot.tags[`${dim}X`] = thisBot.vars.selectPosStart[i].x + deltaX/2;

            selectedBot.tags.scaleY = thisBot.vars.selectScaleStart[i].y - deltaY;
            selectedBot.tags[`${dim}Y`] = thisBot.vars.selectPosStart[i].y + deltaY/2;
        }

        // adjust other nodes to match changes
    }
    // adjust for changes to TOP RIGHT scale node
    else if(bot.tags.stickyNodeID == 2){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.55;
            deltaY -= 0.45;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x + deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y + deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;


        for(let i = 0; i < selBots.length; i++){
            let selectedBot = selBots[i];

            selectedBot.tags.scaleX = thisBot.vars.selectScaleStart[i].x + deltaX;
            selectedBot.tags[`${dim}X`] = thisBot.vars.selectPosStart[i].x + deltaX/2;

            selectedBot.tags.scaleY = thisBot.vars.selectScaleStart[i].y + deltaY;
            selectedBot.tags[`${dim}Y`] = thisBot.vars.selectPosStart[i].y + deltaY/2;
        }

        // adjust other nodes to match changes
    }
    // adjust for changes to TOP LEFT scale node
    else if(bot.tags.stickyNodeID == 3){

        // adjust position for the node to remain at proper distance
        if(isSnapping){
            deltaX += 0.45;
            deltaY -= 0.45;
        }

        // not the node to new grid position
        bot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
        bot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);

        // scale the hightlight bot and shift it to match scale changes on X and Y
        parent.tags.scaleX = thisBot.vars.parentScaleStart.x - deltaX;
        parent.tags[`${dim}X`] = thisBot.vars.parentPosStart.x + deltaX/2;

        parent.tags.scaleY = thisBot.vars.parentScaleStart.y + deltaY;
        parent.tags[`${dim}Y`] = thisBot.vars.parentPosStart.y + deltaY/2;


        for(let i = 0; i < selBots.length; i++){
            let selectedBot = selBots[i];

            selectedBot.tags.scaleX = thisBot.vars.selectScaleStart[i].x - deltaX;
            selectedBot.tags[`${dim}X`] = thisBot.vars.selectPosStart[i].x + deltaX/2;

            selectedBot.tags.scaleY = thisBot.vars.selectScaleStart[i].y + deltaY;
            selectedBot.tags[`${dim}Y`] = thisBot.vars.selectPosStart[i].y + deltaY/2;
        }
    }

    // whisper(bot, "onUpdateNodePositions");

    for(let i = 0; i < selBots.length; i++){
        let stickyArrowBots = getBots(byTag("botID", "stickyArrowNode"), byTag("stickyBotID",selBots[i].id));
        whisper(stickyArrowBots, "onStickyUpdated", selBots[i].id);

        let stickyScaleBots = getBots(byTag("botID", "stickyScaleNode"), byTag("stickyBotID",selBots[i].id));
        whisper(stickyScaleBots, "onStickyUpdated", selBots[i].id);
    }
}



