if (!tags.abAwake) {
    return;
}

const shiftCheck = os.getInputState("keyboard", "Shift");

if (links.abBot && (shiftCheck || (that.modality == "mouse" && that.buttonId == "right" && !links.remember.tags.abRightClickDisabled) || that.forceArmPlacement)) {
    const armBot = ab.links.arm_tool.abCreateArm({
        originBot: links.abBot,
        dimension: that.dimension,
        position: that.position,
    })

    // Fake user dropping the arm on the grid space.
    armBot.onDrop({
        bot: armBot,
        to: {
            x: that.position.x,
            y: that.position.y,
            dimension: that.dimension
        },
        from: {
            x: that.position.x,
            y: that.position.y,
            dimension: that.dimension
        }
    });

    return;
}

const footprint = {
    space: "tempLocal",
    dimension: that.dimension,
    [that.dimension]: true,
    [that.dimension + "X"]: that.position.x,
    [that.dimension + "Y"]: that.position.y,
    positionInfo: that,
    personality: tags.personality,
    remember: tags.remember,
    learn: tags.learn,
    draggable: false,
    cursor: 'alias',
    manager: getLink(thisBot),
    soundCreate: '🧬' + JSON.stringify([ 'ab/audio/grid tap_01.mp3', 'ab/audio/grid tap_02.mp3', 'ab/audio/grid tap_03.mp3', 'ab/audio/grid tap_04.mp3', 'ab/audio/grid tap_05.mp3' ]),
    onCreate: ListenerString(async () => {
        setTimeout(() => destroy(thisBot), 800);

        if (links.remember.tags.abArmMeshPath) {
            if (links.remember.tags.abArmMeshPath.startsWith('https://')) {
                tags.formAddress = links.remember.tags.abArmMeshPath;
            } else {
                tags.formAddress = links.learn.abBuildCasualCatalogURL(links.remember.tags.abArmMeshPath);
            }

            tags.form = 'mesh';
            tags.formSubtype = 'gltf';
            tags.color = links.personality.tags.abBaseStrokeColor;
            tags.strokeColor = links.personality.tags.abBaseStrokeColor;
            tags.anchorPoint = 'center';
        } else {
            tags.color = 'clear';
            tags.strokeColor = links.personality.tags.abBaseStrokeColor;
            tags.scaleZ = 0.01;
        }

        await animateTag(thisBot, {
            fromValue: {
                scaleX: 0.1,
                scaleY: 0.1
            },
            toValue: {
                scaleX: 1.1,
                scaleY: 1.1
            },
            duration: 0.5,
            easing: {
                type: "elastic",
                mode: "out"
            }
        }).catch(e => {});
    }),
    onClick: ListenerString(() => {
        tags[tags.dimension] = false;
        shout("onABFootClicked", { dimension: tags.dimension });
        links.manager.abManifestBot(tags.positionInfo);
        ab.links.sound.abPlaySound({ value: ab.links.arm_tool.tags.defaultArmTeleportSound });
    }),
};


create(footprint);