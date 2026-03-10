if (tags.working) return

var oldStep = masks.step ?? tags.step
var newStep = oldStep - 1

shout("changeStep", {newStep})