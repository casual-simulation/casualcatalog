let supportsAR = os.device().supportsAR;
let supportsVR = os.device().supportsVR;

if (supportsAR || supportsVR)
{
    configBot.masks.menuPortal = "abImmersiveMenu";

    let menuButton = {};

    menuButton.abImmersiveMenu = true;
    menuButton.gridClick = "@ destroy(thisBot);";
    menuButton.abMenuRefresh = "@ destroy(thisBot);";
    menuButton.manifestation = tags.manifestation;
    menuButton.manager = getLink(thisBot);
    menuButton.label = "enter ar/vr";
    menuButton.labelAlignment = "center";
    menuButton.formAddress = "view_in_ar";
    menuButton.color = "#908BFC";
    menuButton.onClick = `@ shout("abMenuRefresh");

    links.manager.initialize();`;

    links.menu.abCreateMenuButton(menuButton);

    menuButton.label = "    ";
    menuButton.formAddress = "cancel";
    
    menuButton.onClick = `@ shout("abMenuRefresh");`;

    links.menu.abCreateMenuButton(menuButton);
}