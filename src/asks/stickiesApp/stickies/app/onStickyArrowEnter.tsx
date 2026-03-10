
let arrowTempBot = getBot("botID", "editStickyNodeArrow");

if(arrowTempBot){

    // get all of the nodes that make an arrow to the temp arrow node
    let arr = [];
    arr = arrowTempBot.tags.nodeList;

    // make sure it isn't null
    if(arr != undefined){
        // loop through all of the nodes connected to the temp
        for(let i = 0; i < arr.length; i++){

            // get the bot that is connected to the temp arrow from ids
            let arrowNodeBot = getBot("id", arr[i]);

            // check arrow bot exists, that this bot is not the same as the bot an arrow is coming from
            if(arrowNodeBot && arr[i] != bot.id){
                let lines = [];
                lines = arrowNodeBot.tags.lineTo;

                if(lines != undefined && lines.length > 0){
                    // swap the line to to this bot
                    for(let j = 0; j < lines.length; j++){
                        if(lines[j] == arrowTempBot.id){
                            lines[j] = bot.id;
                            arrowNodeBot.tags.lineTo = lines;
                        }
                    }
                }else{
                    arrowNodeBot.tags.lineTo = [bot.id];
                }
            }
        }
    }
}