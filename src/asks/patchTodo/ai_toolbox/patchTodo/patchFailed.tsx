await os.startFormAnimation(thisBot, "processing_out").then(() => {
    os.startFormAnimation(thisBot, "error_in").then(() => {
        os.startFormAnimation(thisBot, "error_static", {
            clampWhenFinished
        })
    })
});