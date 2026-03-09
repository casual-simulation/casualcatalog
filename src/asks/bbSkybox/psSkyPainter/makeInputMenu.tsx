//Creating a prompt menu
// configBot.tags.menuPortal = "bbSkybox";
configBot.masks.menuPortal = "bbSkyboxMenu";

thisBot.resetSkyboxMenu();

const promptMenu = {
    formAddress: "edit",
    form: "input",
    label: "Use a prompt to generate skybox",
    onSubmit: `@ 
    let psSkypainterRef = getBot("id",tags.psSkypainterId);
    console.log(psSkypainterRef);
    psSkypainterRef.onCreateSkybox(that.text);
    console.log("SUBMIT");`,
}
const promptCapture = {
    formAddress: "circle",
    label: "Use camera to generate skybox",
    onClick: `@ 
    let psSkypainterRef = getBot("id",tags.psSkypainterId);
    console.log("click capture prompt");
    psSkypainterRef.promptCapture();`,
}
const promptLucky = {
    formAddress: "star",
    label: "I'm feeling LUCKY",
    onClick: `@ 
    let psSkypainterRef = getBot("id",tags.psSkypainterId);
    console.log(psSkypainterRef);
    psSkypainterRef.onCreateSkybox("generate random background with number 7");
    `,
}

let newPromptMenu = await thisBot.addMenuItem(promptMenu);
let newPromptCaptureMenu = await thisBot.addMenuItem(promptCapture);
let newPromptLucky = await thisBot.addMenuItem(promptLucky);