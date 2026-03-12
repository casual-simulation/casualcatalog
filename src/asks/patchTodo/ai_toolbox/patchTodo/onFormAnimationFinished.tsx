console.log("hello", tags.currAnimation)
if (tags.currAnimation == "incomplete_in") {
    os.startFormAnimation(thisBot, "incomplete_static", {clampWhenFinished});
    tags.currAnimation = "incomplete_static";
}

else if (tags.currAnimation == "incomplete_out") {
    os.startFormAnimation(thisBot, "processing_in");
    tags.currAnimation = "processing_in";
}

else if (tags.currAnimation == "processing_in") {
    os.startFormAnimation(thisBot, "processing_loop", {loop});
    tags.currAnimation = "processing_loop";
}

else if (tags.currAnimation == "processing_out") {
    os.startFormAnimation(thisBot, tags.newAnimation);
    tags.currAnimation = tags.newAnimation;
    tags.newAnimation = null;
}

else if (tags.currAnimation == "error_in") {
    os.startFormAnimation(thisBot, "error_static", {clampWhenFinished});
    tags.currAnimation = "error_static";
}

else if (tags.currAnimation == "complete_in") {
    os.startFormAnimation(thisBot, "complete_static", {clampWhenFinished});
    tags.currAnimation = "complete_static";
}