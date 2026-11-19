
let defaultMachineURL = "https://teachablemachine.withgoogle.com/models/dBJN4H14W/";
if (tags.pimID) {
    let pimIDURL = tags.discoverableData ? tags.discoverableData[0]?.attributes?.public_intelligence_model?.data?.attributes?.tmURL : undefined;
    defaultMachineURL = pimIDURL ?? defaultMachineURL;
}
let overrideURL = "";

const urlObj = new URL(configBot.tags.url);
const teachableParam = urlObj.searchParams.get("tmurl"); 

if(teachableParam && teachableParam != ""){
	overrideURL = teachableParam;
}

if(overrideURL && overrideURL != ""){
    defaultMachineURL = overrideURL;
}

await os.openImageClassifier({
    modelUrl: defaultMachineURL,
    cameraType: 'rear'
});

// await os.openImageClassifier({
//     modelUrl: "https://teachablemachine.withgoogle.com/models/dBJN4H14W/",
//     cameraType: 'rear'
// });