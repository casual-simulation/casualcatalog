// changes the collections menu icons when the artifacts are clicked on
let botClicked = that.bot
//let collectionBot = getBot((bot => bot.tags.system?.includes("rot.app.collection")))
//let artifactData = getBot((bot => bot.tags.system?.includes("rot.app.artifactData")))
//let collection = artifactData.tags.artifactInfo

if (botClicked.tags.isArtifact)
{
    let collectionBot = getBot((bot => bot.tags.system?.includes("rot.app.collection")))
   
    let artifactData = getBot((bot => bot.tags.system?.includes("rot.app.artifactData")))
    let collection = artifactData.tags.artifactInfo
    if(collection !== undefined){
        for(let k = 0; k < collection.length; k++ ){
            let artifactInfo = collection[k].attributes
            if(JSON.stringify(artifactInfo) == JSON.stringify(botClicked.tags.attributes)){
                let args = {
                    "index": botClicked.tags.artifactID,
                    "sticky": true,
                    "value":0
                }
                shout("changeItemState", args)
                
                
                let collectionBot = getBot((bot => bot.tags.system?.includes("rot.app.collection1")));
                collectionBot.masks.openCollectionID = botClicked.tags.CollectionID;
                whisper(collectionBot, "getInfo", artifactData.tags.collectableIDs[collectionBot.masks.openCollectionID].indexOf(botClicked.tags.artifactID));
                os.playSound("https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/1259f269-03b9-41d4-b088-c199d8f586ec/0b502198b6e17500a6717f8abdab46106455db08509954f92f01d55b553324a6.mpga");
                
                shout("checkForNewDiscovery")
            }
        }
    }
    destroy(that.bot)
}
else if (botClicked.tags.abIDOrigin=="rot-templateArtifact")
{
    let collectionBot = getBot((bot => bot.tags.system?.includes("rot.app.collection")))
   
    let artifactData = getBot((bot => bot.tags.system?.includes("rot.app.artifactData")))
    let collection = artifactData.tags.artifactInfo
    if(collection !== undefined){
        for(let k = 0; k < collection.length; k++ ){
            let artifactInfo = collection[k].attributes
            if(JSON.stringify(artifactInfo) == JSON.stringify(botClicked.tags.attributes)){
                let args = {
                    "index": botClicked.tags.artifactID,
                    "value": 1
                }
                shout("changeItemState", args)
            }
        }
    }
}

