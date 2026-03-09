// const installedPackages = await os.listInstalledPackages();
// const channelContainer = await os.getPackageContainer(that.data.studioID, that.data.patternID);
// const packageInstalled = installedPackages.packages.find((packageItem) => channelContainer.item.id == packageItem.packageId);

// //Load channel if not already loaded
// if (!packageInstalled) {
//     const response = await os.installPackage(that.data.studioID, that.data.patternID);
//     const launcherBot = getBot("system", "channels.launchers." + that.data.patternID);
//     whisper(launcherBot, "contextPicker");
//     console.log("Channel Loaded:", response);
// }

setTagMask(thisBot, "currentLoadingChannel", that, "local");

//Pull in channel aux
const ask = await ab.links.search.onLookupAskID({
    askID: that,
    sourceEvent: 'ask',
    autoHatch: true,
    isChannel: true
})

if (ask.success) {
    console.log("[abChannel]: Loaded channel", ask);
} else {
    console.log("[abChannel]: Failed to load channel", ask);
}