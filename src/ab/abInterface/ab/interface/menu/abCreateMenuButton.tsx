let newMenuButton = {};

let {
    menuItemStyle = {},
    ...additionalTags
} = that ?? {}

if (typeof menuItemStyle == 'string') {
    menuItemStyle = menuItemStyle.replace(/\u{1F9EC}/u, ''); 
    menuItemStyle = JSON.parse(menuItemStyle);
}

function hasBorderStyle() {
    if (menuItemStyle["border-top-style"] 
        || menuItemStyle["border-left-style"] 
        || menuItemStyle["border-bottom-style"] 
        || menuItemStyle["border-right-style"]) {
            return true;
    }
    return false;
}

if (additionalTags[configBot.tags.menuPortal]) {
    if (additionalTags[configBot.tags.menuPortal + "MenuGroup"]) {

    }
}

newMenuButton.space = "tempLocal";
newMenuButton.color = links.personality.tags.abBaseMenuColor;
newMenuButton.labelColor = links.personality.tags.abBaseMenuLabelColor ?? "#000";
newMenuButton.labelAlignment = "left";
newMenuButton.shadowColor = that.shadowColor ?? links.personality.tags.abBaseShadowColor ?? "#000";
newMenuButton.scaleY = 1;
newMenuButton.soundClick = "🧬" + JSON.stringify([
    "ab/audio/button click_01.mp3",
    "ab/audio/button click_02.mp3",
    "ab/audio/button click_03.mp3"
]);

const menuStyling = {
    "border-radius":"8px",
    "margin-top": "8px",
    "box-shadow": `3px 4px ${newMenuButton.shadowColor}`,
    "min-height": "44px",
    "border": hasBorderStyle() ? "" : `2px solid ${newMenuButton.shadowColor}`,
    "width": "calc(100% - 5px)",
    ...menuItemStyle
}

newMenuButton.menuItemStyle = menuStyling;

const clickedStyling = {
    ...menuStyling,
    "filter": "brightness(60%)"
}
const baseStyle = `@ masks.menuItemStyle = '🧬 ${JSON.stringify(clickedStyling)}'`

newMenuButton.onPointerDown = menuItemStyle?.["margin-top"] != "0px" ? baseStyle : "@ //";
newMenuButton.onPointerUp = `@ masks.menuItemStyle = null`;

for (const tag in additionalTags)
{
    newMenuButton[tag] = additionalTags[tag];
}

newMenuButton = create(newMenuButton);

return newMenuButton;