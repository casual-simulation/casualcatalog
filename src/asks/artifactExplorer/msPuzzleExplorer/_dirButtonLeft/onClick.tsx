if (tags.mode != "play") {
    links.playEdit.onClick();
}
else {
    shout("controllerTouched", {
        user: configBot.id,
        direction: "left",
        button: thisBot.id
    })
}