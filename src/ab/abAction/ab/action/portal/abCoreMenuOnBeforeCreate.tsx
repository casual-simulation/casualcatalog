const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;
const permalinkURL = configBot.tags.permalink;
const activeInst = os.getCurrentInst();
const activeBios = configBot.tags.owner ? "&owner=" + configBot.tags.owner : false;
const firstIndex = permalinkURL.indexOf("&");
const initialURL = permalinkURL.substring(0, firstIndex);
const updatedURL = activeBios != false ? initialURL + "&inst=" + activeInst : initialURL;

setTagMask(thisBot, "abCoreMenuLabel",`mode: ${currentPortal} portal`);
setTagMask(thisBot, "currentDimension", currentDim);
setTagMask(thisBot, "currentPortal", currentPortal);
setTagMask(thisBot, "dropdownSortOrder", 1);

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abPortalMenuRefresh = "@ destroy(thisBot);";
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.onKeyDown = `@ if(that.keys == "Shift"){masks.label = tags.label + " in new tab";}`;
menuOptions.onKeyUp = `@ if(that.keys == "Shift"){masks.label = null;}`;
menuOptions.skillBot = getLink(thisBot);
menuOptions.targetURL = updatedURL;

const mapMenuBot = {
    ...menuOptions
};

mapMenuBot.label = "map portal";
mapMenuBot.formAddress = "public";
mapMenuBot.onClick = `@ 
const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&mapPortal=${currentDim == "blueprint" ? "home" : currentDim}");
}
else
{
    await os.closeCircleWipe();
    configBot.tags.mapPortal = "${currentDim == "blueprint" ? "home" : currentDim}";
    configBot.tags.miniMapPortal = null;
}`;

if (currentPortal != "map")
{
    //map portal button
    dropdownOptions.push(mapMenuBot);
}

const gridMenuBot = {
    ...menuOptions
};
gridMenuBot.label = "grid portal";
gridMenuBot.formAddress = "cube";
gridMenuBot.onClick = `@

const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&gridPortal=${currentDim == "blueprint" ? "home" : currentDim}");
} 
else
{
    configBot.tags.gridPortal = "${currentDim == "blueprint" ? "home" : currentDim}"; configBot.tags.mapPortal = null;
}`;

if (currentPortal != "grid" || currentDim == "blueprint")
{
    //grid portal button
    dropdownOptions.push(gridMenuBot);
}

const blueprintMenuBot = {
    ...menuOptions
};

blueprintMenuBot.label = "blueprint portal";
blueprintMenuBot.formAddress = "architecture";
blueprintMenuBot.onClick = `@

const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&gridPortal=blueprint");
} 
else
{
    configBot.tags.gridPortal = "blueprint"; configBot.tags.mapPortal = null;
}

links.skillBot.abBlueprint();`;

if (currentDim != "blueprint")
{
    //blueprint portal button
    dropdownOptions.push(blueprintMenuBot);
}


const sheetMenuBot = {
    ...menuOptions
};
sheetMenuBot.label = "sheet portal";
sheetMenuBot.formAddress = "table_view";
sheetMenuBot.onClick = `@ 

const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&sheetPortal=${currentDim}");
} 
else
{ 
    configBot.tags.sheetPortal = "${currentDim}";
}`;

//sheet portal button
dropdownOptions.push(sheetMenuBot);


const systemMenuBot = {
    ...menuOptions
};

systemMenuBot.label = "system portal";
systemMenuBot.formAddress = "settings_applications";
systemMenuBot.onClick = `@

const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&systemPortal=true");
} 
else
{ 
    configBot.tags.systemPortal = true;
}`;

//system portal button
dropdownOptions.push(systemMenuBot);

masks.dropdownOptions = dropdownOptions;

return;