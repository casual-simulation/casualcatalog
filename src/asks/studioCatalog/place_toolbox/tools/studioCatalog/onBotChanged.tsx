// if (that.tags.includes("strokeColor")) {
//     if (links.strokeBot) {
//         links.strokeBot.tags.color = tags.strokeColor;
//     }
// }

if (that.tags.includes("selected")) {
    if (tags.selected) {
        shout("onStudioCatalogSelected", thisBot);
        thisBot.lockStudio();
    } else {
        shout("onStudioCatalogDeselected", thisBot);
        thisBot.moveStudio();
    }
}