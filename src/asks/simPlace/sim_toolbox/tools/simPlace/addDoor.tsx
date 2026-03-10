if (!tags.doors) {
    tags.doors = [];
}

if (!tags.lineTo) {
    tags.lineTo = [];
}

const simID = that?.tags?.simID;

if (simID) {
    if (!tags.doors.includes(simID)) {
        tags.doors.push(simID);
        tags.lineTo.push(that?.id);
    }

    const simDoor = getBot(byTag("destination", that.tags.simID), byTag(tags.chosenDimension, true));
    if (simDoor) {
        os.toast("simDoor already exists");
        return;
    }

    const xVal = Math.round(Math.random() * 15);
    const yVal = Math.round(Math.random() * 15);

    const abArtifactShard = {
        data: {
            config: {
                label: that.tags.label,
                destination: that.tags.simID,
                dimensionData: {
                    dimension: tags.chosenDimension,
                    [tags.chosenDimension]: true,
                    [tags.chosenDimension + 'X']: xVal,
                    [tags.chosenDimension + 'Y']: yVal
                }
            }
        },
        dependencies: [
            {
                askID: 'simDoor'
            }
        ]
    };
    ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'simDoor',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });
}

tags.choosingDoor = false;