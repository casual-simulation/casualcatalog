// Save whether or not we will be editing to make sure the old tag's value is never used
const willEdit = !tags.editing

// Update tag & color
tags.editing = willEdit
tags.color = willEdit ? '#0dd157' : '#fa4043'

const sequence = stepManager.tags.sequence
const step = stepManager.tags.step

// Find the bots in the step
var stepBots = getBots(byTag("sequence", sequence), byTag("step", step))

if (willEdit) {
    for (var b of stepBots) {
        b.masks.label = b.tags.name ?? 'No Name'
        b.masks.labelPosition = 'floating'
    }
} else {
    for (var b of stepBots) {
        setTagMask(b, "label", null)
        setTagMask(b, "labelPosition", null)
    }
}