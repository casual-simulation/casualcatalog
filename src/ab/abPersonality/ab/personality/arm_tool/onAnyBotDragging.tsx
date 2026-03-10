const dragBot = that.bot;
const dimension = that.from.dimension;

if (dragBot.links.armBot) {
    if (dragBot.tags.armGroupDrag && dragBot.links.armSelectedBots) {
        let dragCoordinatorBot = links.dragCoordinatorBot;
        
        if (!dragCoordinatorBot) {
            const dragCoordinatorMod = {
                space: "tempLocal",
                manager: getLink(thisBot),
                dimension: dimension,
                [dimension]: true,
                [dimension + "X"]: 0,
                [dimension + "Y"]: 0,
                [dimension + "Z"]: -1,
                pointable: false,
                debug: tags.debug,
                color: "clear",
                system: `armGroupDrag.${thisBot.id.substring(0, 5)}.coordinator`,
                onAnyBotPointerUp: ListenerString(() => {
                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] destroying drag coordinator`);
                    }

                    links.manager.masks.dragCoordinatorBot = null; 
                    shout('onArmStopGroupDrag', { x: tags[tags.dimension + 'X'], y: tags[tags.dimension + 'Y'] });
                    destroy(thisBot);
                }),
            };

            dragCoordinatorBot = create(dragCoordinatorMod);

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] created drag coordinator bot:`, dragCoordinatorBot);
            }

            masks.dragCoordinatorBot = getLink(dragCoordinatorBot);

            const armSelectedBots = dragBot.links.armSelectedBots;
            const onArmStopGroupDrag = `@
                masks.transformer = null;
                masks.onArmStopGroupDrag = null;
                tags.${dimension}X = tags.${dimension}X + that.x;
                tags.${dimension}Y = tags.${dimension}Y + that.y;
            `

            dragBot.masks.transformer = dragCoordinatorBot.id;
            dragBot.masks.onArmStopGroupDrag = onArmStopGroupDrag;

            setTagMask(armSelectedBots, "transformer", dragCoordinatorBot.id, "tempLocal");
            setTagMask(armSelectedBots, "onArmStopGroupDrag", onArmStopGroupDrag, "tempLocal");
        }

        const xChange = that.to.x - that.from.x;
        const yChange = that.to.y - that.from.y;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] xChange: ${xChange}, yChange: ${yChange}`);
        }

        dragCoordinatorBot.tags[dimension + "X"] = xChange;
        dragCoordinatorBot.tags[dimension + "Y"] = yChange;
        dragCoordinatorBot.tags[dimension + "Z"] = -1;
    } else {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] drag bot with arm does not qualify for group dragging.`);
        }
    }
}