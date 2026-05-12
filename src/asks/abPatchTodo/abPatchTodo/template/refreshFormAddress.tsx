const meshMap = {
    'build': '/asks/meshes/todoBot_build.glb',
    'plan': '/asks/meshes/todoBot_plan.glb',
};

const meshPath = meshMap[tags.agentMode];
if (!meshPath) return;

const targetFormAddress = ab.abBuildCasualCatalogURL(meshPath);

if (masks.formAddress === targetFormAddress) return;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] update formAddress for agentMode '${tags.agentMode}'`);
}

masks.form = 'mesh';
masks.formAddress = targetFormAddress;
masks.formAddressAnimations = await os.listFormAnimations(thisBot);

thisBot.refreshAnimation();
