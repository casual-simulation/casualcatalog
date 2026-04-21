let discoverablesArr = await thisBot.getClosestObject();
let img = await os.capturePhoto({
    cameraType: "rear"
})

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
    let arrayString= ""
    for (var i = 0; i < discoverablesArr.length; i++) {
        arrayString+=("{ Name: "+ discoverablesArr[i].Name + ", Description: " + discoverablesArr[i].Description + ", Link: '" + discoverablesArr[i].GRPMUrl +"'} ")
    }
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

    tags.discoverableURL = response.content;

    destroy(loadingBar);
    thisBot.openApp();
} catch (e) {
    console.log("Failed to find image match", e);
    os.toast("Error finding match");
    destroy(loadingBar);
}
