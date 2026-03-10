const THREE = thisBot.vars.three;
const OrbitControls = thisBot.vars.orbitControls;

const EffectComposer = thisBot.vars.effectComposer;
const RenderPass = thisBot.vars.renderPass;
const ShaderPass = thisBot.vars.shaderPass;

const RGBShiftShader = thisBot.vars.rgbShiftShader;

const UnrealBloomPass = thisBot.vars.unrealBloomPass;
const params = {
				threshold: 0,
				strength: .8,
				radius: 0.2,
				exposure: 2
			};

const DotScreenShader = thisBot.vars.dotScreenShader;
const OutputPass = thisBot.vars.outputPass;

const RenderPixelatedPass = thisBot.vars.pixelPass;

const OrderedDitherPass = thisBot.vars.orderedDither;

const { useState, useCallback, useEffect, useRef } = os.appHooks;

const width = gridPortalBot.tags.pixelWidth;
const height = gridPortalBot.tags.pixelHeight;

const App = () => {
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('rgb(0, 4, 10)');
    const camera = new THREE.OrthographicCamera( width / - 60, width / 60, height / 60, height / - 60, 1, 10000 );
    // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    
    thisBot.vars.canvas = renderer.domElement;
    document.body.style.overflow = 'hidden';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.toneMapping = THREE.NeutralToneMapping;
    // renderer.toneMappingExposure = 1;

    document.body.appendChild(renderer.domElement);

    //position camera
    const camPos = os.getCameraPosition('grid');
    if (camPos) {
        camera.position.set(camPos.x, camPos.z, -camPos.y);
    }
    const camRot = os.getFocusPoint('grid');
    if (camRot) {
        camera.lookAt(camRot);
    }    

    let plight = new THREE.PointLight(0xffffff, .6, 100);
    plight.position.set(1, 3, 1);
    plight.castShadow = true;
    plight.shadow.radius = 3;
    scene.add(plight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

    const light = new THREE.HemisphereLight(0x0000ff, 0xff0000, 3);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI/3; 
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    }

    thisBot.collectBots(scene);

    const composer = new EffectComposer( renderer );
    composer.addPass( new RenderPass( scene, camera ) );

    if (tags.filterType == 'dots') {
        const effect1 = new ShaderPass( DotScreenShader );
        effect1.uniforms[ 'scale' ].value = 4;
        composer.addPass( effect1 );

        const effect2 = new ShaderPass( RGBShiftShader );
        effect2.uniforms[ 'amount' ].value = 0.0015;
        composer.addPass( effect2 );
    } else if (tags.filterType == 'bloom') {
        const bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.threshold;
        bloomPass.strength = params.strength;
        bloomPass.radius = params.radius;
        composer.addPass(bloomPass);
    } else if (tags.filterType == 'pixels') {
        const renderPixelatedPass = new RenderPixelatedPass( 4, scene, camera );
		composer.addPass( renderPixelatedPass );
    }
    else if (tags.filterType == 'vintage') {
        const orderedDitherEffect = new OrderedDitherPass(4, 1);
        composer.addPass( orderedDitherEffect );

        const effect2 = new ShaderPass( RGBShiftShader );
        effect2.uniforms[ 'amount' ].value = 0.0015;
        composer.addPass( effect2 );

        // const bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 1.5, 0.4, 0.85 );
        // bloomPass.threshold = 0;
        // bloomPass.strength = .1;
        // bloomPass.radius = .05;
        // bloomPass.smoothing = 1;
        // composer.addPass(bloomPass);

        
    }

    const effect3 = new OutputPass();
    composer.addPass( effect3 );

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //onClick events
    document.addEventListener('click', (event) => {
        mouse.x = (event.clientX / width) * 2 - 1;
        mouse.y = -(event.clientY / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            getBot(byID(clickedObject.name))?.onClick();
        } else {
            shout("onGridClick");
        }
    });
    
    const animate = function () {
        if (tags.activeFilter == true) {
            requestAnimationFrame.call(window, animate);
            controls.update();
            composer.render();
        }
    };
    animate();

    const onCloseClick = useCallback(() => {
        thisBot.closeFilterApp();
    }, [])
    
    return (
        <div id='app'>
        <button 
            onClick={onCloseClick}
            style= {{
                position: 'fixed',
                top: 0,
                right: 0,
                padding: '6px 16px',
                margin: '10px',
            }}
        >Close</button>
        </div>
    );
}

return App;