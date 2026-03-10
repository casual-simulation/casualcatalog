let portal = configBot.tags.mapPortal
// if we arent in the mapPortal, use gridPortal
if (portal === undefined) {
    portal = configBot.tags.gridPortal
}

let posX = tags[portal + "X"];
let posY = tags[portal + "Y"];
if (!tags["playerNear" + configBot.id]) { return; }
else {
    
    // shout("openLandmarkUI", [tags.landmarkAttributes.Name, tags.landmarkAttributes.Latitude, tags.landmarkAttributes.Longitude, tags.landmarkAttributes.Description, tags.landmarkAttributes.PhotoUrl, null, null]);
    if (!tags.discoveredArtifact) {
        //tags.discovered = true
        let collectionBot = getBot(byTag("name", "collectionsMenu"))
        //if (collectionBot.tags.collectionsCompletion[tags.allData.CollectionID] > 0 || !tags.allData.RequiresCollection) {
        if (tags.form=="mesh") {
            console.log("spawnArtifact")
            //tags.color = "";
            //tags.color="#ff9f19"
            //let xOffSet = tags.customOffset.xOffset ?? math.random(.00025, .0004);
            //let yOffSet = tags.customOffset.yOffset ?? math.random(.0002, .0003);
            let xOffSet = math.random(.00025, .0004);
            let yOffSet = math.random(.0002, .0003);
            if (tags.customOffset === undefined) {
                if (math.random(0, 10) > 5) { xOffSet *= -1 }
                if (math.random(0, 10) > 5) { yOffSet *= -1 }
            }
            let pointBot = create({
                form: "sprite",
                formAddress: tags.discoveredFormAddress ?? "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/f1bbae58-61d7-48d2-9ec9-47dbd463eca9/534934f21f53bd9f8168abbefdd5719d5e292b253a645a88f506c2f646804826.png",
                [portal]: true,
                attributes: tags.attributes,
                artifactID: tags.artifactID,
                CollectionID: tags.CollectionID,
                [portal + "X"]: posX + xOffSet,
                [portal + "Y"]: posY + yOffSet,
                scale: 3,
                isArtifact: true,
                orientationMode: "billboard"
            })
            tags.form="";
            tags.scale=0.6
            tags.discoveredArtifact = true
        }
        else {
            //tags.color = "#4198bf";
        }
    }
    if (!tags.discovered)
    {
        os.playSound("https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/1259f269-03b9-41d4-b088-c199d8f586ec/61098ca5d7eb2debaff331abe1ca0e5eb90a4b3fec1c28388b00819f899d96a7.mpga");
        tags.discovered=true;
        tags.color="#04b1ff"
        
    }
}