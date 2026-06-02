const instStudioConfig = await ab.links.search.abStudioConfig({ studioId: tags.studioId });
const hasCustomMesh = !!instStudioConfig?.studio_catalog_mesh_url;

if (hasCustomMesh) {
    if (links.defaultVisualBot) {
        destroy(links.defaultVisualBot);
        tags.defaultVisualBot = null;
    }

    tags.hasCustomMesh = true;
    tags.form = 'mesh';
    tags.formAddress = instStudioConfig.studio_catalog_mesh_url;
    tags.color = abPersonality?.tags?.abBaseColor ?? '#00D9CD';

    if (tags.strokeFormAddress) {
        tags.strokeFormAddress = null;
    }

    // if (tags.strokeBot) {
    //     destroy(links.strokeBot);
    //     tags.strokeBot = null;
    // }

    tags.scaleMode = null; // Need to do this so that the floating billboard is positioned correctly.
}

if (instStudioConfig?.studio_catalog_scale != null) {
    tags.scaleX = instStudioConfig.studio_catalog_scale;
    tags.scaleY = instStudioConfig.studio_catalog_scale;
    tags.scaleZ = instStudioConfig.studio_catalog_scale;
}

if (instStudioConfig?.studio_catalog_color) {
    tags.color = instStudioConfig.studio_catalog_color;
}

tags.labelColor = instStudioConfig?.studio_catalog_label_color ?? 'black';
tags.labelFloatingBackgroundColor = instStudioConfig?.studio_catalog_label_background_color ?? 'white';

return hasCustomMesh;