/*//Should send in the item number to change the state of (0-8)
//"that" should be [collectionName, itemNumber (0-8)]
console.log("running")
if (that[0] == tags.name){
    if (masks.items[that[1]] == 2) masks.items[that[1]] = 0;
    else masks.items[that[1]] = 2;

    //masks.items[that[1]] = !masks.items[that[1]];
    //masks.items = masks.items;

    //Save
    if (authBot?.id){
        let saveLoad = getBot(byTag("name", "saveload"));
        saveLoad.save(tags.name);
    }
}*/

//Should send in the item id to change the state of
//"that" should be item id
console.log("running")
let saveLoad = getBot(byTag("name", "saveload"));

let index = 0
let sticky = false
let value=0
// if it's an object account for other variables passed
if (typeof that === "object") {
    // sticky is whether an object should stay once it's flipped to true (or 2 in this case)
    sticky = that.sticky
    // the original that
    index = that.index
    value=that.value
}
else {
    index = that
}
if(value==1)
{
    if (saveLoad.masks.itemSaves[index - 1] == 0) saveLoad.masks.itemSaves[index - 1] = 1;
}
else if (saveLoad.masks.itemSaves[index - 1] == 2 && !sticky) saveLoad.masks.itemSaves[index - 1] = 0;
else saveLoad.masks.itemSaves[index - 1] = 2;

//Save
if (authBot?.id) {
    let saveLoad = getBot(byTag("name", "saveload"));
    saveLoad.save();
}