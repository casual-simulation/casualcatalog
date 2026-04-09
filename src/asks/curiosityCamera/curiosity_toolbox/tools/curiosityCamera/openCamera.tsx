let discoverablesArr = await thisBot.getClosestObject();
let img = await os.capturePhoto({
    cameraType: "rear"
})

tags.takenPhoto=true;

//add loading bar??
//thisBot.openApp();

//os.toast(discoverablesArr);
configBot.tags.menuPortal = "curiosityCameraLoading";
let loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "analyzing",
    curiosityCameraLoading: true
});

let chosenAIModel = 'claude-sonnet-4-0';
const aiModels = configBot.tags.aiChatModels ?? [];
if (!aiModels.find(model => model.name == 'claude-sonnet-4-0')) {
    chosenAIModel = abPersonality.tags.abPreferredAIModel;
}

try {
    // let output = bytes.toBase64Url(await img.data.arrayBuffer())
    // const blob = bytes.fromBase64Url(output);
    // const result = await os.recordFile("vRK2.bXlQdWJsaWNSZWNvcmQ=.N3NodjlpMzBURHJ2MU1GZ0hwNkw4Zz09.subjectfull", blob);

    // let x="45N"
    // let y="82E"
    let arrayString= ""
    for (var i = 0; i < discoverablesArr.length; i++) {
        arrayString+=("{ Name: "+ discoverablesArr[i].Name + ", Description: " + discoverablesArr[i].Description + ", Link: '" + discoverablesArr[i].GRPMUrl +"'} ")
    }
    //text: `Look at the descriptions and names of these objects "${arrayString}", which are listed in order of closest to furthest from my current location, and tell me the name of which object is likely in this image and include the link associated with it in the format of "This appears to be an " + objectName + ". You can find more info about it at " + link". If there are no likely matches, say "There are no matching objects"`
    const response = await ai.chat({
            role: 'user',
            content: [
                {
                    text: `Look at the descriptions and names of these objects "${arrayString}", which are listed in order of closest to furthest from my current location, and find which object is most likely in this image by comparing the name with any labels in the image and have the response be only the link associated with it with no other characters. If there are no likely matches, say "There are no matching objects"`
                },
                {
                    base64: bytes.toBase64String(new Uint8Array(await img.data.arrayBuffer())),
                    mimeType: img.data.type,
                }
            ]
        }, 
        {
            preferredModel: chosenAIModel
    });

    tags.takenPhoto=false

    //thisBot.closeApp();
    tags.discoverableURL = response.content;

    destroy(loadingBar);
    thisBot.openApp();
} catch (e) {
    console.log("Failed to find image match", e);
    os.toast("Error finding match");
    destroy(loadingBar);
}
