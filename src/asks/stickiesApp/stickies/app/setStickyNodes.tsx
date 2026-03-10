
const dim = os.getCurrentDimension();
let nodeScale = 0.1;

// let editNodes = getBots("botID", "stickyScaleNode");
// destroy(editNodes);

let highlightNode = getBot("botID", "highlightSticky");
// let stickyNodes = getBots("stickyHighlightID", highlightNode.id);

const botData = {
    space:"tempLocal",
    stickyHighlightID: highlightNode.id,
    labelColor: '#000000',
    abIgnore: true,
    form: "sphere",
    scaleX: nodeScale,
    scaleY: nodeScale,
    scaleZ: nodeScale,
}

let x = 0;
let y = 0;
let z = 0.1;

// generate the scale nodes (spheres) of the highlight
for(let i = 0; i < 4; i++){
    if(i == 0){
        x = -highlightNode.tags.scaleX/2;
        y = -highlightNode.tags.scaleY/2;
    }
    else if(i == 1){
        x = highlightNode.tags.scaleX/2;
        y = -highlightNode.tags.scaleY/2;
    }
    else if(i == 2){
        x = highlightNode.tags.scaleX/2;
        y = highlightNode.tags.scaleY/2;
    }
    else if(i == 3){
        x = -highlightNode.tags.scaleX/2;
        y = highlightNode.tags.scaleY/2;
    }

    botData["botID"] = "stickyScaleNode";
    botData["stickyNodeID"] = i;
    botData["highlightBotID"] = highlightNode.id;
    botData["stickyBotID"] = highlightNode.tags.selectedBot;

    // set the nodes to be the corner scaling nodes
    botData["color"] = "#fff";
    botData[`${dim}X`] = highlightNode.tags[`${dim}X`] + x;
    botData[`${dim}Y`] = highlightNode.tags[`${dim}Y`] + y;
    botData[`${dim}Z`] = z;

    botData["onDrag"] = bot.tags.onStickyScaleDragStart;
    botData["onDragging"] = bot.tags.onStickyScaleDrag;
    botData["onDrop"] = bot.tags.onStickyScaleDragStop;
    botData["onStickyUpdated"] = bot.tags.onStickyUpdate;

    botData[dim] = true;
    create(botData);
}

let stickyBots = getBots("sticky", true);

for(let j = 0; j < stickyBots.length; j++){

    // set arrow nodes for sticky if they don't exist
    for(let i = 0; i < 4; i++){
        let directionArray = ["N", "E", "S", "W"];

        let checkBot = getBot(byTag("stickyBotID", stickyBots[j].id), byTag("stickyNodeID", directionArray[i]))
        if(checkBot){
            checkBot.tags.color = "#3f58f6";
            checkBot.tags.pointable = true;
            checkBot.tags.stickyHighlightID = highlightNode.id;
            continue;
        }

        botData["space"] = "shared";
        botData["botID"] = "stickyArrowNode";
        botData["stickyNodeID"] = directionArray[i];

        let stickyBot = stickyBots[j];
        let arrowOffset = 0.25;

        if(i == 0){
            x = 0;
            y = stickyBot.tags.scaleY/2 + arrowOffset;
        }
        else if(i == 1){
            x = stickyBot.tags.scaleX/2 + arrowOffset;
            y = 0;
        }
        else if(i == 2){
            x = 0;
            y = -stickyBot.tags.scaleY/2 - arrowOffset;
        }
        else if(i == 3){
            x = -stickyBot.tags.scaleX/2 - arrowOffset;
            y = 0;
        }

        botData["stickyBotID"] = stickyBot.id;
        // set the nodes to be the cardinal arrow making nodes
        botData["color"] = "#3f58f6";
        botData[`${dim}X`] = stickyBot.tags[`${dim}X`] + x;
        botData[`${dim}Y`] = stickyBot.tags[`${dim}Y`] + y;
        botData[`${dim}Z`] = z;

        botData["onDrag"] = bot.tags.onStickyArrowDragStart;
        botData["onDragging"] = bot.tags.onStickyArrowDrag;
        botData["onDrop"] = bot.tags.onStickyArrowDragStop;
        botData["onPointerEnter"] = bot.tags.onStickyArrowEnter;
        botData["onPointerExit"] = bot.tags.onStickyArrowExit;
        botData["onStickyUpdated"] = bot.tags.onStickyUpdate;
        
        botData[dim] = true;
        create(botData);
    }
}