tags.collectableAmounts = [];
tags.collectableIDs = [[], [], []];
const collectableResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/collectables?populate=*',
    headers: 
    {
        "Authorization":"Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07" 
    }
})
let tempArray=[]
tags.artifactCollectableInfo = (collectableResponse.data.data).sort((a, b) => a.id - b.id);
for (let i=0;i<collectableResponse.data.data.length;i++)
{
    tempArray.push(collectableResponse.data.data[i].attributes.Artifact.data.attributes.Name);

    /*if (collectableResponse.data.data[i].attributes.ShowAsMenu == true){
        tags.collectionNames[collectableResponse.data.data[i].attributes.CollectionID] = collectableResponse.data.data[i].attributes.Name;
        tags.collectionNames = tags.collectionNames;
    }*/

    if (tags.collectableAmounts[collectableResponse.data.data[i].attributes.CollectionID] == null || tags.collectableAmounts[collectableResponse.data.data[i].attributes.CollectionID] == undefined || tags.collectableAmounts[collectableResponse.data.data[i].attributes.CollectionID] == 0){
        tags.collectableAmounts[collectableResponse.data.data[i].attributes.CollectionID] = 1;
        tags.collectableAmounts = tags.collectableAmounts;
    }
    else{
        tags.collectableAmounts[collectableResponse.data.data[i].attributes.CollectionID]++;
        tags.collectableAmounts = tags.collectableAmounts;
    }

    tags.collectableIDs[collectableResponse.data.data[i].attributes.CollectionID].push(collectableResponse.data.data[i].id);
    tags.collectableIDs = tags.collectableIDs;
}

const artifactResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/artifacts',
    headers: 
    {
        "Authorization":"Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07" 
    }
})
let artifactArray=[]
for (let i=0;i<artifactResponse.data.data.length;i++)
{
    for (let j=0;j<tempArray.length;j++)
    {
        //console.log(artifactResponse.data.data[i].attributes.Name + " and "+tempArray[j])
        if (artifactResponse.data.data[i].attributes.Name==tempArray[j])
        {
            //console.log("match")
            artifactArray.push(artifactResponse.data.data[i])
        }
    }
}
tags.artifactInfo = artifactArray.sort((a, b) => a.id - b.id);
console.log(tags.artifactInfo.length)

/*let saveLoad = getBot(byTag("name", "saveload"));
saveLoad.masks.itemSaves = [];
for (let i = 0; i < tags.artifactInfo[tags.artifactInfo.length - 1].id; i++){
    saveLoad.masks.itemSaves[i] = 0;
}*/

const collectionsResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/collections',
    headers: 
    {
        "Authorization":"Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07" 
    }
})
//os.log(collectionsResponse);
tags.collectionsInfo = (collectionsResponse.data.data).sort((a, b) => a.id - b.id);
tags.collectionNames = [];
for (let collection of tags.collectionsInfo) {
    tags.collectionNames[collection.attributes.CollectionID] = collection.attributes.Name;
}