/*//Should send in the item number to change the state of (0-8)
//"that" should be [collectionName, itemNumber (0-8)]
if (that[0] == tags.name){
    if (masks.items[that[1]] == 1) masks.items[that[1]] = 0;
    else masks.items[that[1]] = 1;

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

if (saveLoad.masks.itemSaves[that-1] == 1) saveLoad.masks.itemSaves[that-1] = 0;
else saveLoad.masks.itemSaves[that-1] = 1;

//Save
if (authBot?.id){
    let saveLoad = getBot(byTag("name", "saveload"));
    saveLoad.save();
}