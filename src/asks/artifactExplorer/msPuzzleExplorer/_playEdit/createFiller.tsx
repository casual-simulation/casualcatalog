let fillerTags = {
    space: "shared",
    home: true,
    homeX: 3,
    homeY: -6,
    scaleZ: 0.01,
    color: "black",
    form: "sprite",
    onBoardStateChange: `@ that == "edit" ? destroy(thisBot) : null;`,
    system: "msPuzzleExplorer._dPadFiller",
    draggable: false
}

create(fillerTags);