
const dim = os.getCurrentDimension();

// remove the highlight box bot
let highlightBot = getBot("botID", "highlightSticky")
destroy(highlightBot);

// remove the edit nodes around the highlight box bot
// let editNodes = getBots("botID", "stickyScaleNode");
// destroy(editNodes);

let scaleBots = getBots("botID", "stickyScaleNode");
destroy(scaleBots);
let arrowBots = getBots("botID", "stickyArrowNode");
// destroy(arrowBots);

for(let i = 0; i < arrowBots.length; i++){
    arrowBots[i].tags.pointable = false;
    // arrowBots[i].tags.color = "red";
    arrowBots[i].tags.color = "clear";
}