configBot.tags.menuPortal = "scaleModelWizardLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "parsing photo",
    scaleModelWizardLoading: true
});

const response = await ai.chat({
    role: 'user',
    content: [
        {
            text: `Please generate a detailed "description" of what is in the captured image, following these rules:
                a. Do not use any special characters or asteriks.
                b. Make it a clear concise prompt.
                c. keep in mind this prompt is for generating a scale model, so pay attention to places, and objects in the space.
            
            Not following the above rules could hurt or break the experience.
            `
        },
        {
            base64: bytes.toBase64String(new Uint8Array(await that.data.arrayBuffer())),
            mimeType: that.data.type,
        }
    ]
}, 
{
    preferredModel: abPersonality.tags.abPreferredAIModel
});

destroy(loadingBar);

let promptResponse = response.content;

console.log("PROMPT: "+promptResponse);

if (promptResponse) {
    thisBot.generateFromPrompt(promptResponse);
} else {
    os.toast("Invalid AI response");
}