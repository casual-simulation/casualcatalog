// used to determine what rhetoric bot should do while in action mode

// creates the prompt for the ai to determine what course of action to go with.
let actionPrompt = `Determine from the following message if a user wants any of the following options carried out: `;
actionPrompt += ` PDF interpretation, 2D image generation, or other. User message: "`;
actionPrompt += that.message;
actionPrompt += `" Respond with a one word response corresponding to what they want:`
actionPrompt += ` "PDF" for pdf interpretation,`;
actionPrompt += ` "IMG" for 2D image generation,`;
actionPrompt += ` or "AB1" for some other action.`
actionPrompt += ` If a user wants you to make something for them, unless the mention making a picture or image, assume they don't want a 2D image.`
actionPrompt += ` Anything other than a single word response that is "PDF", "IMG" or "AB1" is considered a failure.`

// gets the action type from the ai model interpretting the user message
let actionType = await ai.chat(actionPrompt, {
    preferredModel: tags.aiModel
});

console.log("action mode response: ", actionType);

switch (actionType) {
    case "PDF":
        thisBot.interpretPDF();
        break;
    case "IMG": // currently disabled from image generation until the ai.generateImage function is fixed.
        thisBot.postMessage({ "message": "Image generation is temporarily disabeled due to an issue. We hope to have the issue fixed soon.", "publicMessage": false })
        // thisBot.postMessage({ "message": "Generating image...", "publicMessage": false });
        // const imageAddress = await ai.generateImage({
        //     prompt: message,
        // });
        // const angle = Math.random() * 2 * Math.PI;
        // const radius = 5;

        // create({
        //     space: "shared",
        //     home: true,
        //     homeX: (radius * Math.cos(angle)) + tags.homeX,
        //     homeY: (radius * Math.sin(angle)) + tags.homeY,
        //     scaleZ: 0.01,
        //     scaleX: 3,
        //     scaleY: 3,
        //     formAddress: imageAddress
        // })
        break;
    case "AB1":
        let askBot = getBot(byTag("system", "ab.action.ask"))
        askBot.abCoreMenuAction({ message: that.message, menu: "core" });
        break;
}