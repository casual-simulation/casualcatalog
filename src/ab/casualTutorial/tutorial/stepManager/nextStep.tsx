if (tags.working) return

var oldStep = thisBot.masks.step ?? thisBot.tags.step ?? 0
var newStep = Number(oldStep) + 1

// Check if we should be done
if (tags.endSteps[tags.sequence] == newStep) {
    shout("showEnd", {sequence: tags.sequence})
} else {
    shout("changeStep", {newStep})
}