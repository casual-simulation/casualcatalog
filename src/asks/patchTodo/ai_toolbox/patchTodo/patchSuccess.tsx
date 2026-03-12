await os.startFormAnimation(thisBot, "processing_out").then(() => {
    os.startFormAnimation(thisBot, "complete_in").then(() => {
        os.startFormAnimation(thisBot, "complete_static", {
            clampWhenFinished
        })
    })
});