if (tags.doors && tags.doors.includes(that)) {
    const tempDoors = [...tags.doors];
    tempDoors.splice(tempDoors.indexOf(that), 1);
    tags.doors = tempDoors;

    const removedID = getID(getBot("simID", that));
    const tempLines = [...tags.lineTo];
    tempLines.splice(tempLines.indexOf(removedID), 1);
    tags.lineTo = tempLines;

    const destinationBot = getBot("simID", that);
    const doorBot = getBot(byTag("destination", destinationBot.tags.simID), byTag(tags.chosenDimension, true));
    destroy(doorBot);
}