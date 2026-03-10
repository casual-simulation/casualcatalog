// finds the specfic app we're looking for
// if (that === "mini") {
//     return thisBot.openMiniLoc()
// }
if (that === "menu") {
    return thisBot.openMenu()
}
else if (that === "awaitingLocationPermission"){
    return thisBot.openLocationPermission()
}
else{
    console.log("couldn't find: " + that)
}

