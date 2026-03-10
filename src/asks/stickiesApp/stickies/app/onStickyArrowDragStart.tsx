
os.enableCustomDragging();
abRemember.tags.abBotSnapState = false;
abRemember.tags.abGridSnapState = false;

const dim = os.getCurrentDimension();
thisBot.vars.dimension = dim;

let parent = getBot("id", bot.tags.stickyHighlightID);
parent.tags.pointable = false;

let stickyBot = getBot("id", bot.tags.stickyBotID);
stickyBot.tags.pointable = false;

let nodeScale = 0.1;

// create a bot to pair the arrow to
const botData = {
    space:"tempLocal",
    botID: "editStickyNodeArrow",
    stickyID: stickyBot.id,
    nodeList: [],
    color: 'clear',
    abIgnore: true,
    form: "sphere",
    scaleX: nodeScale,
    scaleY: nodeScale,
    scaleZ: nodeScale,
    pointable:false,
}

thisBot.vars.dragStart = {x: tags[`${dim}X`] ?? 0, y: tags[`${dim}Y`] ?? 0};

botData[`${dim}X`] = thisBot.vars.dragStart.x;
botData[`${dim}Y`] = thisBot.vars.dragStart.y;
botData[dim] = true;
let arrowTempBot = create(botData);

bot.tags.lineStyle = "line";
let lineWidth = 4;
if(stickyBot.tags.lineWidth != undefined){
    lineWidth = stickyBot.tags.lineWidth;
}

bot.tags.lineWidth = lineWidth;

let lineColor = "#000";
if(stickyBot.tags.lineColor != undefined){
    lineColor = stickyBot.tags.lineColor;
}

bot.tags.lineColor = lineColor;


// if this bot is not lined to any other node
let arrowBots = getBots(byTag("botID", "stickyArrowNode"), byTag("lineTo"));

let existingConnection = false;
let nodeList = [];

for(let i = 0; i < arrowBots.length; i++){
    // if the arrow node isn't this bot
    if(arrowBots[i].id != bot.id){
        let arr = [];
        arr = arrowBots[i].tags.lineTo;

        //if arrow node DOES have a lineTo
        if(arr != undefined && arr.length > 0){
            // check if it is a line to for this bot
            for(let j = 0; j < arr.length; j++){
                if(arr[j] == bot.id){
                    existingConnection = true;
                    nodeList.push(arrowBots[i].id);
                    arr[j] = arrowTempBot.id;
                    arrowBots[i].tags.lineTo = arr;
                }
            }
        }
    }
}

if(!existingConnection){
    nodeList.push(bot.id);

    if(bot.tags.lineTo != undefined && Array.isArray(bot.tags.lineTo)){
        let arr = bot.tags.lineTo;
        arr.push(arrowTempBot.id);
        bot.tags.lineTo = arr;
    }
    else{
        bot.tags.lineTo = [arrowTempBot.id];
    }
}

arrowTempBot.tags.nodeList = nodeList;