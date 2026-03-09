let { 
    bot,
    dimension,
    space = 'tempLocal',
    debug,
    faceOffset = 0.01,
    pointable = false,
    tickIntervalMS = 500,
    ...rest
} = that ?? {};

assert(links.utils.isBot(bot), `[${tags.system}.${tagName}] bot is a required Bot parameter.`);
assert(dimension, `[${tags.system}.${tagName}] dimension is a required parameter.`);
assert(rest.form == null, `[${tags.system}.${tagName}] form is a reserved tag.`);
assert(rest.anchorPoint == null, `[${tags.system}.${tagName}] anchorPoint is a reserved tag.`);
assert(rest.onBotAdded == null, `[${tags.system}.${tagName}] onCreate is a reserved tag.`);

const facePlaneMod = {
    space,
    anchorPoint: 'center',
    debug,
    faceOffset,
    form: 'sprite',
    dimension,
    [dimension]: true,
    pointable,
    tickIntervalMS,
    transformer: bot.id,
    onBotAdded: ListenerString(() => {
        thisBot.startTick();
    }),
    onBotChanged: ListenerString(() => {
        if (that.tags.includes('tickIntervalMS')) {
            thisBot.stopTick();
            thisBot.startTick();
        }

        if (that.tags.includes('transformer')) {
            if (!tags.transformer) {
                destroy(thisBot);
            }
        }
    }),
    onAnyBotsRemoved: ListenerString(() => {
        if (tags.transformer) {
            if (that.botIDs.includes(tags.transformer)) {
                destroy(thisBot);
            }
        }
    }),
    onDestroy: ListenerString(() => {
        thisBot.stopTick();

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] destroyed`);
        }
    }),
    setDimension: ListenerString(() => {
        const dimension = that;

        if (tags.dimension !== dimension) {
            // Remove from previous dimension.
            tags[tags.dimension] = null;
            tags[tags.dimension + 'Position'] = null;
            tags[tags.dimension + 'Rotation'] = null;

            if (dimension) {
                // Assign to new dimension.
                tags.dimension = dimension;
                tags[dimension] = true;
            }
        }

    }),
    startTick: ListenerString(() => {
        if (masks.tickIntervalId) {
            return;
        }

        masks.tickIntervalId = setInterval(() => whisper(thisBot, 'tick'), tags.tickIntervalMS);
        thisBot.tick();
    }),
    stopTick: ListenerString(() => {
        if (masks.tickIntervalId) {
            clearInterval(masks.tickIntervalId);
            masks.tickIntervalId = null;
        }
    }),
    tick: ListenerString(() => {
        const LOCAL_NORMALS = [
            new Vector3(1, 0, 0), // +X
            new Vector3(-1, 0, 0), // -X
            new Vector3(0, 1, 0), // +Y
            new Vector3(0, -1, 0), // -Y
        ]

        const LOCAL_POSITIONS = [
            new Vector3(0.5 + tags.faceOffset, 0, -0.5), // +X
            new Vector3(-0.5 - tags.faceOffset, 0, -0.5), // -X
            new Vector3(0, 0.5 + tags.faceOffset, -0.5), // +Y
            new Vector3(0, -0.5 - tags.faceOffset, -0.5), // -Y
        ]

        const HALF_PI = Math.PI / 2;

        const LOCAL_ROTATIONS = [
            new Rotation({ euler: { x: HALF_PI, y: HALF_PI, z: 0 }}), // +X
            new Rotation({ euler: { x: HALF_PI, y: -HALF_PI, z: 0 }}), // -X
            new Rotation({ euler: { x: -HALF_PI, y: 0, z: Math.PI }}), // +Y
            new Rotation({ euler: { x: HALF_PI, y: 0, z: 0 }}), // -Y
        ]

        /**
         * Set the face plane to be on the given face index.  
         * 0: +X,  
         * 1: -X,  
         * 2: +Y,  
         * 3: -Y
         */
        function setPlaneFace(faceIndex) {
            masks[tags.dimension + 'Position'] = LOCAL_POSITIONS[faceIndex];
            masks[tags.dimension + 'Rotation'] = LOCAL_ROTATIONS[faceIndex];
        }

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] dimension:`, tags.dimension);
        }

        if (!tags.dimension) {
            return;
        }

        const parentPosition = getBotPosition(tags.transformer, tags.dimension);

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] parent position:`, parentPosition);
        }

        let gridPortalType: 'grid' | 'miniGrid' | null = null;

        if (configBot.tags.gridPortal === tags.dimension) {
            gridPortalType = 'grid';
        } else if (configBot.tags.miniGridPortal === tags.dimension) {
            gridPortalType = 'miniGrid';
        }

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] detected grid portal type:`, gridPortalType);
        }

        if (!gridPortalType) {
            setPlaneFace(0);
            return;
        }

        const cameraPosition = os.getCameraPosition(gridPortalType);

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] camera position:`, cameraPosition);
        }

        const directionToCamera = cameraPosition.subtract(parentPosition).normalize();

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] direction to camera:`, directionToCamera);
        }

        const parentRotation = getBotRotation(tags.transformer, tags.dimension);
        const worldNormals: Vector3[] = new Array(4);
        for (let i = 0; i < 4; i++) {
            worldNormals[i] = parentRotation.rotateVector3(LOCAL_NORMALS[i]);
        }

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] world normals:`, worldNormals);
        }
        
        // Find the face most facing the camera (max dot product). 
        let bestIndex = 0; 
        let bestDot = Number.NEGATIVE_INFINITY; 
        
        for (let i = 0; i < worldNormals.length; i++) {
            const dot = worldNormals[i].dot(directionToCamera);
            if (dot > bestDot) {
                bestDot = dot; 
                bestIndex = i; 
            }
        }

        if (tags.debug) {
            console.log(`[${thisBot.id.substring(0, 5)}.${tagName}] best face index:`, bestIndex);
        }

        setPlaneFace(bestIndex);
    }),
    ...rest
}

const facePlaneBot = create(facePlaneMod);

return facePlaneBot;