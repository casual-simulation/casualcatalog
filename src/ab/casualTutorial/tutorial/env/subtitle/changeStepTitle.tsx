var { sequence, newStep } = that
// Update label based
setTagMask(thisBot, "label", tags.stepTitles[sequence][newStep - 1], "local")