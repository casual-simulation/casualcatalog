import * as THREE from 'https://esm.sh/three@0.162.0';
import { GLTFLoader } from 'https://esm.sh/three@0.162.0/addons/loaders/GLTFLoader.js';

import { OrbitControls } from "https://esm.sh/three@0.162.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://esm.sh/three@0.162.0/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.162.0/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.162.0/addons/postprocessing/ShaderPass.js';

import { RGBShiftShader } from 'https://esm.sh/three@0.162.0/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'https://esm.sh/three@0.162.0/addons/shaders/DotScreenShader.js';
import { OutputPass } from 'https://esm.sh/three@0.162.0/addons/postprocessing/OutputPass.js';

import { UnrealBloomPass } from 'https://esm.sh/three@0.162.0/addons/postprocessing/UnrealBloomPass.js';

import { RenderPixelatedPass } from 'https://esm.sh/three@0.162.0/addons/postprocessing/RenderPixelatedPass.js';

import { OrderedDitherPass } from 'https://esm.sh/gh/samwhitford/threejs-ordered-dithering-effect/OrderedDitherPass.js?deps=three@0.162.0';

thisBot.vars.three = THREE;
thisBot.vars.orbitControls = OrbitControls;
thisBot.vars.effectComposer = EffectComposer;
thisBot.vars.renderPass = RenderPass;
thisBot.vars.shaderPass = ShaderPass;
thisBot.vars.gltfLoader = GLTFLoader;

thisBot.vars.rgbShiftShader = RGBShiftShader;
thisBot.vars.dotScreenShader = DotScreenShader;
thisBot.vars.outputPass = OutputPass;
thisBot.vars.unrealBloomPass = UnrealBloomPass;
thisBot.vars.pixelPass = RenderPixelatedPass;
thisBot.vars.orderedDither = OrderedDitherPass;
