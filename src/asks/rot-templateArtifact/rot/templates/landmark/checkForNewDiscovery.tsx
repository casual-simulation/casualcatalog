let collectionBot = getBot(byTag("name", "collectionsMenu"))
if (collectionBot.tags.collectionsCompletion[tags.allData.CollectionID] > 0 || !tags.allData.RequiresCollection) 
{
    if (!tags.discoveredArtifact)
    {
        tags.form="mesh";
        tags.scale=3
    }
}
console.log("check")