const backgroundColor = links.remember?.tags.abBlueprintColor ?? "#1785B5";

if (backgroundColor == gridPortalBot.masks.portalColor)
{
    return;
}

gridPortalBot.masks.portalColor = backgroundColor;

masks.onPortalChanged = `@ if (that.portal == "gridPortal" && that.dimension != "blueprint"){
    // links.remember.masks.abBaseColor = null;
    // links.remember.masks.abBaseStrokeColor = null;

    gridPortalBot.masks.portalColor = null;

    masks.onPortalChanged = null;
}`;

shout("abMenuRefresh");