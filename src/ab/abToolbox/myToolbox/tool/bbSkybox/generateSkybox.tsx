if (tags.formAddress == 0) 
{
    let skyboxGenerator = getBot("name", "psSkyPainter");

    tags.formAddress = await skyboxGenerator.generateSkybox(tags.input);
}

shout("skyboxReset");

const dimension = configBot.tags.gridPortal;
const skybox = {};

skybox.space = "tempLocal";
skybox[dimension] = true;
skybox[dimension + "RotationX"] = 1.5708;
skybox[dimension + "RotationY"] = 0;
skybox[dimension + "Z"] = -100;
skybox.anchorPoint = "center";
skybox.form = "skybox";
skybox.park = true;
skybox.formAddress = tags.formAddress;
skybox.pointable = false;
skybox.skyboxReset = "@ destroy(thisBot);";
skybox.system = "park.bot.skybox";
skybox.scale = 450;

create(skybox);

gridPortalBot.tags.portalCameraType = "perspective";
gridPortalBot.tags.portalPannableMaxX = 30;
gridPortalBot.tags.portalPannableMinX = -30;
gridPortalBot.tags.portalPannableMaxY = 30;
gridPortalBot.tags.portalPannableMinY = -30;
gridPortalBot.tags.portalZoomable = false;

return;