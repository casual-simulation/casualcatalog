if (tags.currAnimation?.includes("incomplete")) {
    thisBot.changeAnimationState("incomplete_in");
}
else if (tags.currAnimation?.includes("error")) {
    thisBot.changeAnimationState("error_in");
}
else if (tags.currAnimation?.includes("complete")) {
    thisBot.changeAnimationState("complete_in");
}
else if (tags.currAnimation?.includes("processing")) {
    thisBot.changeAnimationState("processing_in");
}