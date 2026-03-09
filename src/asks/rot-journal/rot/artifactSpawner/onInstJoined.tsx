console.log("artifactSpawner Joined")
const collectionResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/collectables?populate=*',
    headers:
    {
        "Authorization": "Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07"
    }
})
console.log("[RoT] contacted strapi")
tags.artifactLocationData = (collectionResponse.data.data).sort((a, b) => a.id - b.id);
let tempArray = []
for (let i = 0; i < collectionResponse.data.data.length; i++) {
    tempArray.push(collectionResponse.data.data[i].attributes.Artifact.data.attributes.Name)
}
const artifactResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/artifacts',
    headers:
    {
        "Authorization": "Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07"
    }
})
let artifactArray = []
for (let i = 0; i < artifactResponse.data.data.length; i++) {
    for (let j = 0; j < tempArray.length; j++) {
        //console.log(artifactResponse.data.data[i].attributes.Name + " and " + tempArray[j])
        if (artifactResponse.data.data[i].attributes.Name == tempArray[j]) {
            //console.log("match")
            artifactArray.push(artifactResponse.data.data[i])
        }
    }
}
tags.artifactData = artifactArray.sort((a, b) => a.id - b.id);
const landmarkResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/landmarks',
    headers:
    {
        "Authorization": "Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07"
    }
})
tags.landmarkData = (landmarkResponse.data.data).sort((a, b) => a.id - b.id);
const discoverableResponse = await web.hook({
    method: 'GET',
    url: 'https://generous-eggs-66ccb5f42c.strapiapp.com/api/discoverables?pagination[start]=0&pagination[limit]=100',
    headers:
    {
        "Authorization": "Bearer 86b20df42323b5bceb010a3274238da52afa06cd3267713f4e284bdf0c3a1acb7ea91f59390203c529456ed7ae594ef1654267a2e32a52f19c1c7f10df0d640cf8e4b0d6821b691b9df9ae79e43575e738071ab2fb244bfa2c957090acee283e73428faeb67342bec3f4277f717d6c7cc6cd6719103997c85cf1e2a071365e07"
    }
})
tags.discoverableData = (discoverableResponse.data.data).sort((a, b) => a.id - b.id);
//spawn on start
let artifactVisualData = thisBot.getArtifactVisualData()
let artifactLocationData = thisBot.getArtifactLocationData()

if (!configBot.tags.streetsMode){
thisBot.spawnArtifactGroup()
}