
// onStickyUpdate

if(that == bot.tags.stickyBotID){
    const dim = os.getCurrentDimension();

    let x = 0;
    let y = 0;

    if(bot.tags.botID == "stickyArrowNode"){
        let arrowOffset = 0.25;
        let stickyBot = getBot("id", that);

        if(bot.tags["stickyNodeID"] == "N"){
            x = 0;
            y = stickyBot.tags.scaleY/2 + arrowOffset;
        }
        else if(bot.tags["stickyNodeID"] == "E"){
            x = stickyBot.tags.scaleX/2 + arrowOffset;
            y = 0;
        }
        else if(bot.tags["stickyNodeID"] == "S"){
            x = 0;
            y = -stickyBot.tags.scaleY/2 - arrowOffset;
        }
        else if(bot.tags["stickyNodeID"] == "W"){
            x = -stickyBot.tags.scaleX/2 - arrowOffset;
            y = 0;
        }

        bot.tags[`${dim}X`] = stickyBot.tags[`${dim}X`] + x;
        bot.tags[`${dim}Y`] = stickyBot.tags[`${dim}Y`] + y;
    }
    else if(bot.tags.botID == "stickyScaleNode"){
        let highlightNode = getBot("id", bot.tags.highlightBotID);
        let stickyBot = getBot("id", highlightNode.tags.selectedBot);


        let selBots = getBots("selected", true);

        if(selBots.length == 1){
            highlightNode.tags[`${dim}X`] = stickyBot.tags[`${dim}X`] + x;
            highlightNode.tags[`${dim}Y`] = stickyBot.tags[`${dim}Y`] + y;
        }
        else{

            let padding = 0.2;

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

            let sx = (maxX - minX);
            let sy = (maxY - minY);

            // console.log("111xxxxxxxxxxxxxxxx: ", minY);
            // console.log("222xxxxxxxxxxxxxxxx: ", maxY);
            // console.log("333xxxxxxxxxxxxxxxx: ", sy);
            // botData["scaleX"] = sx;
            // botData["scaleY"] = sy;

            let xx = (minX) + sx/2;
            let yy = (minY) + sy/2;

            // botData[`${dim}X`] = xx;
            // botData[`${dim}Y`] = yy;

            highlightNode.tags[`${dim}X`] = xx;
            highlightNode.tags[`${dim}Y`] = yy;
        }

        if(bot.tags["stickyNodeID"] == 0){
            x = -highlightNode.tags.scaleX/2;
            y = -highlightNode.tags.scaleY/2;
        }
        else if(bot.tags["stickyNodeID"] == 1){
            x = highlightNode.tags.scaleX/2;
            y = -highlightNode.tags.scaleY/2;
        }
        else if(bot.tags["stickyNodeID"] == 2){
            x = highlightNode.tags.scaleX/2;
            y = highlightNode.tags.scaleY/2;
        }
        else if(bot.tags["stickyNodeID"] == 3){
            x = -highlightNode.tags.scaleX/2;
            y = highlightNode.tags.scaleY/2;
        }

        bot.tags[`${dim}X`] = highlightNode.tags[`${dim}X`] + x;
        bot.tags[`${dim}Y`] = highlightNode.tags[`${dim}Y`] + y;
    }
}