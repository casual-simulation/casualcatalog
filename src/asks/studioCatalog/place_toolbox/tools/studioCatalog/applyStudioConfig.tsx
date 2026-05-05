const instStudioConfig = await ab.links.search.abStudioConfig({ studioId: tags.studioId });
const hasCustomMesh = !!instStudioConfig?.studio_catalog_mesh_url;

if (hasCustomMesh) {
    tags.formAddress = instStudioConfig.studio_catalog_mesh_url;

    if (tags.strokeFormAddress) {
        tags.strokeFormAddress = null;
    }

    if (tags.strokeBot) {
        destroy(tags.strokeBot);
        tags.strokeBot = null;
    }
}

if (instStudioConfig?.studio_catalog_scale != null) {
    tags.scaleX = instStudioConfig.studio_catalog_scale;
    tags.scaleY = instStudioConfig.studio_catalog_scale;
    tags.scaleZ = instStudioConfig.studio_catalog_scale;
}

if (instStudioConfig?.studio_catalog_color) {
    tags.color = instStudioConfig.studio_catalog_color;
}

return hasCustomMesh;