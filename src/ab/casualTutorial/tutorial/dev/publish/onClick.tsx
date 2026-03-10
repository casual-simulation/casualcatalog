// Make sure no bots associated with a step are home
let stepBots = getBots(byTag("step"))
for (var b of stepBots) {
    // b.tags.home = false
    setTag(b, "home", null)
    clearTagMasks(b)
}

// Reset the step manager
stepManager.tags.sequence = "intro"
stepManager.tags.step = 0

// Reset the titles
shout("changeTitle", {sequence: "intro"})
shout("changeStepTitle", {sequence: "intro", newStep: 1})