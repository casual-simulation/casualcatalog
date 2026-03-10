const photo = await os.capturePhoto();
if (!photo)
{
    return;
}

configBot.tags.menuPortal = "simPlaceLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "Generating sim place",
    simPlaceLoading: true
});

const response = await ai.chat({
    role: 'user',
    content: [
        {
            text: `Please generate 2 items and return them in JSON.

            1. A "name" for the captured image, following these rules:
                a. Do not exceed 3 words.
                b. The name must be representative of what is in the image.
                c. Do not use any special characters or asteriks.
            2. a detailed "description" of what is in the captured image, following these rules:
                a. Do not use any special characters or asteriks.
                b. Make a it a clear concise prompt.
                c. Please limit it to 150 words or less.
            
            Not following the above rules could hurt or break the experience.

            RESPONSE FORMAT EXAMPLE: 
                {
                    "name": "My Image Name",
                    "description": "This is where the image description goes"
                }
            `
        },
        {
            base64: bytes.toBase64String(new Uint8Array(await photo.data.arrayBuffer())),
            mimeType: photo.data.type,
        }
    ]
}, 
{
    preferredModel: ab.links.personality.tags.abPreferredAIModel
});

destroy(loadingBar);

let promptResponse = response.content?.replaceAll('`', '');
promptResponse = promptResponse.replaceAll('\n', '');
if (promptResponse.indexOf('json') == 0) {
    promptResponse = promptResponse.replace('json', '');
}

try {
  promptResponse = JSON.parse(promptResponse);  
} catch (e) {
    console.log("Error: ", e);
}

console.log("PROMPT: "+promptResponse);

if (promptResponse?.description && promptResponse?.name) {
    thisBot.createSkybox({prompt: promptResponse?.description, target: promptResponse?.name, dimension: promptResponse?.name});
} else {
    os.toast("Invalid AI response");
}




