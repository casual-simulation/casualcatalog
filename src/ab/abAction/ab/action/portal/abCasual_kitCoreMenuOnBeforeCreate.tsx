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

setTagMask(thisBot, "abBuilderCoreMenuLabel",`current portal: ${currentPortal}`);
setTagMask(thisBot, "currentDimension", currentDim);
setTagMask(thisBot, "currentPortal", currentPortal);
setTagMask(thisBot, "dropdownSortOrder", 0);

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

mapMenuBot.label = "map";
mapMenuBot.formAddress = "public";
mapMenuBot.onClick = `@ 
shout("abMenuRefresh");
const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&mapPortal=${currentDim == "blueprint" ? "home" : currentDim}");
}
else
{
    try {
        await os.closeCircleWipe({
            color: abPersonality.tags.abBaseColor
        });
    } catch (e) {
        console.log("Could not close circle wipe", e); 
    }
    
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
gridMenuBot.label = "grid";
gridMenuBot.formAddress = "cube";
gridMenuBot.onClick = `@
shout("abMenuRefresh");
const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&gridPortal=${currentDim == "blueprint" ? "home" : currentDim}");
} 
else
{
    try {
        await os.closeCircleWipe({
            color: abPersonality.tags.abBaseColor
        });
    } catch (e) {
        console.log("Could not close circle wipe", e); 
    }
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

blueprintMenuBot.label = "blueprint";
blueprintMenuBot.formAddress = "architecture";
blueprintMenuBot.onClick = `@
shout("abMenuRefresh");
const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&gridPortal=blueprint");
} 
else
{
    try {
        await os.closeCircleWipe({
            color: abPersonality.tags.abBaseColor
        });
    } catch (e) {
        console.log("Could not close circle wipe", e); 
    }
    configBot.tags.gridPortal = "blueprint"; configBot.tags.mapPortal = null;
    await os.openCircleWipe({
        color: abPersonality.tags.abBaseColor
    });
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
sheetMenuBot.label = "sheet";
sheetMenuBot.formAddress = "table_view";
sheetMenuBot.onClick = `@ 
shout("abMenuRefresh");
const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&sheetPortal=${currentDim}");
} 
else
{ 
    try {
        await os.closeCircleWipe({
            color: abPersonality.tags.abBaseColor
        });
    } catch (e) {
        console.log("Could not close circle wipe", e); 
    }
    configBot.tags.sheetPortal = "${currentDim}";
}`;

//sheet portal button
dropdownOptions.push(sheetMenuBot);


const systemMenuBot = {
    ...menuOptions
};

systemMenuBot.label = "system";
systemMenuBot.formAddress = "settings_applications";
systemMenuBot.onClick = `@
shout("abMenuRefresh");
const state = os.getInputState("keyboard", "Shift");

if(state)
{
    os.openURL(tags.targetURL + "&systemPortal=true");
} 
else
{ 
    try {
        await os.closeCircleWipe({
            color: abPersonality.tags.abBaseColor
        });
    } catch (e) {
        console.log("Could not close circle wipe", e); 
    }
    configBot.tags.systemPortal = true;
}`;
dropdownOptions.push(systemMenuBot);

//auth portal button
const authMenuBot = {
    ...menuOptions
};

authMenuBot.label = "account";
authMenuBot.formAddress = "account_circle";
authMenuBot.onClick = `@
shout("abMenuRefresh");
const state = os.getInputState("keyboard", "Shift");
const endpoint = await os.getRecordsEndpoint();

if(state)
{
    os.openURL(endpoint);
} 
else
{ 
    os.goToURL(endpoint);
}`;

dropdownOptions.push(authMenuBot);

masks.dropdownOptions = dropdownOptions;

return;