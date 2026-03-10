configBot.tags.menuPortal = "storyPlaceLoading";
let loadingBar = await ab.links.menu.abCreateMenuBusyIndicator({
    label: "Naming sim place",
    storyPlaceLoading: true
});

const response = await ai.chat({
    role: 'user',
    content: [
        {
            text: `return ONLY a short label (3 words maximum) for a skybox that will be generated with this description: ${that}.
                RESPONSE EXAMPLE: "Field of Daisies"
            `
        }
    ]
}, 
{
    preferredModel: abPersonality.tags.abPreferredAIModel
});

destroy(loadingBar);

if (response.content) {
    return response.content;
}
else {
    os.toast("error generating name for sim place.");
    destroy(loadingBar);
    return;
}