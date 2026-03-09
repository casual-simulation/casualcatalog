configBot.tags.menuPortal = "bbSkybox";

let promptYes = {
    bbSkybox:true,
    bbSkyboxId: tags.id,
    color:"yellow",
    label:"Import Skybox Generator",
    onClick:tags.onClickYes,
}

let makePromptYes = await thisBot.addMenuItem(promptYes);

let promptNo = {
    bbSkybox:true,
    color:"red",
    label:"Cancel",
    onClick:tags.onClickNo,
}

let makePromptNo = await thisBot.addMenuItem(promptNo);