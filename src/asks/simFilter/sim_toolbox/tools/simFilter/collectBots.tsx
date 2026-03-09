const THREE = thisBot.vars.three;
const GLTFLoader = thisBot.vars.gltfLoader;
const textureLoader = new THREE.TextureLoader();

const scene = that;

const dimension = ab.links.remember.tags.abActiveDimension;
let botCollection = getBots(byTag(dimension, true), not(byTag("filterIgnore", true)), not(byTag("space", "tempLocal")));
for (let bot of botCollection) {
    if (!getBotPosition(bot, dimension)) {
        continue;
    }

    const objectFromBot = new THREE.Group();
    let defaultScale = bot.tags.scale ?? 1;
    let botScaleX = bot.tags.scaleX ?? defaultScale;
    let botScaleY = bot.tags.scaleY ?? defaultScale;
    let botScaleZ = bot.tags.scaleZ ?? defaultScale;

    if (bot.tags.transformer) {
        const transformerBot = getBot(byID(bot.tags.transformer));
        if (transformerBot) {
            defaultScale = transformerBot.tags.scale ?? bot.tags.scale ?? 1;
            botScaleX = (transformerBot.tags.scaleX * bot.tags.scaleX ?? 1) ?? defaultScale;
            botScaleY = (transformerBot.tags.scaleY * bot.tags.scaleY ?? 1) ?? defaultScale;
            botScaleZ  = (transformerBot.tags.scaleZ * bot.tags.scaleZ ?? 1) ?? defaultScale;
        }
    }

    if (bot.tags.form == 'mesh' && bot.tags.formSubtype == 'gltf' && bot.tags.formAddress) {
        const loader = new GLTFLoader();
        
        const gltf = await loader.loadAsync(bot.tags.formAddress);
        const mesh = gltf.scene;
        
        //SCALING
        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const targetSize = new THREE.Vector3(botScaleX, botScaleZ, botScaleY);

        const scaleFactorX = targetSize.x / size.x;
        const scaleFactorY = targetSize.y / size.y;
        const scaleFactorZ = targetSize.z / size.z;

        const uniformScale = Math.min(scaleFactorX, scaleFactorY, scaleFactorZ);

        objectFromBot.scale.set(uniformScale, uniformScale, uniformScale);

        objectFromBot.add( mesh );
        const botPosition = getBotPosition(bot, dimension);
        const botRotation = getBotRotation(bot, dimension);

        objectFromBot.position.set(botPosition.x, (botScaleZ / 2) + (botPosition.z ?? 0), -botPosition.y);
        objectFromBot.setRotationFromQuaternion(new THREE.Quaternion(botRotation._q.x, botRotation._q.z, botRotation._q.y, botRotation._q.w));
        mesh.name = bot.id;

        scene.add(objectFromBot);
        continue;
    }

    let geometry;
    let material;
    if (bot.tags.form == 'sphere') {
        geometry = new THREE.SphereGeometry((botScaleX) / 2, 32, 16 );

        if (bot.tags.formAddress) {
            const texture = textureLoader.load(bot.tags.formAddress);
            texture.colorSpace = THREE.SRGBColorSpace; 

            material = new THREE.MeshBasicMaterial({
                map: texture
            });
        }
    }
    else if (bot.tags.form == 'skybox') {
        const texture = textureLoader.load(bot.tags.formAddress);
        texture.colorSpace = THREE.SRGBColorSpace; 

        material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });

        geometry = new THREE.SphereGeometry((botScaleX) / 2, 32, 16 );
    } else {
        geometry = new THREE.BoxGeometry( botScaleX, botScaleZ, botScaleY);
    }

    if (!material) {
        material = new THREE.MeshStandardMaterial({color: bot.tags.color && bot.tags.color !== "clear" ? bot.tags.color : 0xFFFFFF});
    }
    const mesh = new THREE.Mesh( geometry, material );
    const botPosition = getBotPosition(bot, dimension);
    const botRotation = getBotRotation(bot, dimension);
    objectFromBot.add(mesh);
    if (bot.tags.form == 'skybox') {
        objectFromBot.position.set(0, 0, 0);
    } else {
        objectFromBot.position.set(botPosition.x, ((botScaleZ) / 2) + (botPosition.z ?? 0), -botPosition.y);
        objectFromBot.setRotationFromQuaternion(new THREE.Quaternion(botRotation._q.x, botRotation._q.z, botRotation._q.y, botRotation._q.w));
    }
    
    mesh.name = bot.id;

    scene.add(objectFromBot);
}