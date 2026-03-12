const formerAnimation = tags.currAnimation;
const newAnimation = that;
tags.formAnimation = null;

if (newAnimation == "incomplete") {
    await os.startFormAnimation(thisBot, "incomplete_in").then(() => {
        tags.formAnimation = "incomplete_static"
    });
    tags.currAnimation = "incomplete";
}

else if (newAnimation == "processing") {
    await os.startFormAnimation(thisBot, formerAnimation + "_out").then(() => {
        await os.startFormAnimation(thisBot, newAnimation + "_in").then(() => {
            tags.formAnimation = "processing_loop"
        })
    });
    tags.currAnimation = "processing";
}

else if (newAnimation == "error") {
    await os.startFormAnimation(thisBot, formerAnimation + "_out").then(() => {
        await os.startFormAnimation(thisBot, newAnimation + "_in").then(() => {
            tags.formAnimation = "error_static"
        })
    });
    tags.currAnimation = "error";
}

else if (newAnimation == "complete") {
    await os.startFormAnimation(thisBot, formerAnimation + "_out").then(() => {
        await os.startFormAnimation(thisBot, newAnimation + "_in").then(() => {
            tags.formAnimation = "complete_static"
        })
    });
    tags.currAnimation = "complete";
}
else {
    console.log("[Error playing animation]: could not find animation ", newAnimation)
}

