// Get the other parts of the speech bubble
var bubbleTail = getBot(byTag("type", "speechBubbleTail"))
var speechTransformer = getBot(byTag("type", "speechBubbleTransformer"))

var dim = os.getCurrentDimension()

setTagMask(thisBot, dim, null, "local")
setTagMask(bubbleTail, dim, null, "local")
setTagMask(speechTransformer, dim, null, "local")