
// that = [botid, botid]

if(that == undefined){
    // hide highlight
    return;
}

await os.sleep(100);

let selBots = getBots("selected", true);
// console.log("mmmmmmmmmmmmmmm: ", selBots);

// let selectedArray = [];
// selectedArray = bot.tags.selectedStickies;

let padding = 0.2;
const dim = os.getCurrentDimension();

// console.log("bbbbbbbbbbbbb: ", selectedArray);
// bot.tags.selectedStickies = selectedArray;

if(selBots.length == 1){
    // slinge select

    let selectedBot = getBot("id", that[0]);

    let highlightNode = getBot("botID", "highlightSticky");
    destroy(highlightNode);

    let scaleBots = getBots("botID", "stickyScaleNode");
    destroy(scaleBots);

    // create the highlight box bot
    const botData = {
        space:"tempLocal",
        botID: "highlightSticky",
        labelColor: '#000000',
        abIgnore: true,
        pointable:false,
        color:"clear",
        strokeColor: "#3F58F6",
        strokeWidth: 4,
        scaleZ: 0.1,
        selectedBot:that[0],
    }

    botData[`${dim}X`] = selectedBot.tags[`${dim}X`];
    botData[`${dim}Y`] = selectedBot.tags[`${dim}Y`];

    botData["scaleX"] = selectedBot.tags.scaleX + padding;
    botData["scaleY"] = selectedBot.tags.scaleY + padding;

    botData[dim] = true;
    create(botData);

    // create the edit modes around the hightlight box bot
    whisper(bot, "setStickyNodes", that);

    let arrowBots = getBots("botID", "stickyArrowNode");
    // destroy(arrowBots);

    for(let i = 0; i < arrowBots.length; i++){
        arrowBots[i].tags.pointable = true;
        arrowBots[i].tags.color = "#3f58f6";
    }
}
else if(selBots.length > 1){
    // multi select

    // get info from the multi select
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    for(let i = 0; i < selBots.length; i++){
        let sticky = selBots[i];

        let x = sticky.tags[`${dim}X`];
        let y = sticky.tags[`${dim}Y`];

        let stickyScaleX = sticky.tags.scaleX + padding;
        let stickyScaleY = sticky.tags.scaleY + padding;

        let left = x - stickyScaleX/2;
        let right = x + stickyScaleX/2;
        let top = y + stickyScaleY/2;
        let bottom = y - stickyScaleY/2;

        if(i == 0 || left < minX){
            minX = left;
        }

        if(i == 0 || right > maxX){
            maxX = right;
        }

        if(i == 0 || top > maxY){
            maxY = top;
        }

        if(i == 0 || bottom < minY){
            minY = bottom;
        }
    }

    let highlightNode = getBot("botID", "highlightSticky");
    destroy(highlightNode);

    let scaleBots = getBots("botID", "stickyScaleNode");
    destroy(scaleBots);


    // create the highlight box bot
    const botData = {
        space:"tempLocal",
        botID: "highlightSticky",
        labelColor: '#000000',
        abIgnore: true,
        pointable:false,
        color:"clear",
        strokeColor: "#3F58F6",
        strokeWidth: 4,
        scaleZ: 0.1,
        selectedBot:that[0],
    }

    let sx = (maxX - minX);
    let sy = (maxY - minY);

    // console.log("111xxxxxxxxxxxxxxxx: ", minY);
    // console.log("222xxxxxxxxxxxxxxxx: ", maxY);
    // console.log("333xxxxxxxxxxxxxxxx: ", sy);
    botData["scaleX"] = sx;
    botData["scaleY"] = sy;

    let xx = (minX) + sx/2;
    let yy = (minY) + sy/2;

    botData[`${dim}X`] = xx;
    botData[`${dim}Y`] = yy;

    botData[dim] = true;
    create(botData);

    whisper(bot, "setStickyNodes", that);

    // do not show arrows on multi select
    let arrowBots = getBots("botID", "stickyArrowNode");

    for(let i = 0; i < arrowBots.length; i++){
        arrowBots[i].tags.pointable = false;
        arrowBots[i].tags.color = "clear";
    }
}