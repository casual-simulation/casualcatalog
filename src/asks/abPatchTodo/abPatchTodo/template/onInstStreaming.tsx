if (tags.currAnimation?.includes("incomplete")) {
    thisBot.handleAnimationState("incomplete_in");
}
else if (tags.currAnimation?.includes("error")) {
    thisBot.handleAnimationState("error_in");
}
else if (tags.currAnimation?.includes("complete")) {
    thisBot.handleAnimationState("complete_in");
}
else if (tags.currAnimation?.includes("processing")) {
    thisBot.handleAnimationState("processing_in");
}