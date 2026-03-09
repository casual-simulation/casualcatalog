//loads a csv through a google sheet url (the sheet url or share url)
let sheetLink = "https://docs.google.com/spreadsheets/d/1j8EHqkK1AN7MZLVKVA2y79nO_xecgXtc__7dJxXed54/edit?usp=sharing";

// temporary, revert back after updating the main sheet
// let sheetLink = "https://docs.google.com/spreadsheets/d/1RwLmNBjY8LrsuM0966LZ1H-k8gewkuRh-EFjmSgzoVs/edit?usp=sharing";

let possibleGID = sheetLink.indexOf("#gid");

if (possibleGID != -1) {
    possibleGID = sheetLink.substring(possibleGID);
}

sheetLink = sheetLink.replace("?usp=sharing" || possibleGID, "");

sheetLink = sheetLink.replace("edit", "export?format=csv");

let response = await web.hook({
    method: 'GET',
    url: sheetLink
});
if (response.status == 200) {
    let processedData = thisBot.csvToJson(response.data);
    console.log("processedData: ", processedData);
    // const dataKeys = Object.keys(processedData);
    let offset = await thisBot.getOffset();

    for (let i = 0; i < processedData.tilesetName.length; i++) {
        let xCoord = i < 3 ? [-3, -1, 1][i] : [-3, -1, 1, 3][(i - 3) % 4];
        let yCoord = i < 3 ? 6 : 8 + 2 * Math.floor((i - 3) / 4);

        let tilesetBot = getBot(byTag("tilesetName", processedData.tilesetName[i]));

        if (!tilesetBot) {
            let imageSetBot = {
                space: "tempLocal",
                gameBoard: tags.gameBoard,
                getOffset: tags.getOffset,
                tilesetBot: true,
                tilesetName: processedData.tilesetName[i],
                // onBoardStateChange: `@  if(that == "play"){ tags.home = false; } else if(that == "edit"){ tags.home = true; };`,
                tilesetNumber: i,
                resetTilesetPositions: `@
                    let i = tags.tilesetNumber;
                    let xCoord = i < 3 ? [-3, -1, 1][i] : [-3, -1, 1, 3][(i - 3) % 4];
                    let yCoord = i < 3 ? 6 : 8 + 2 * Math.floor((i - 3) / 4);
                    let offset = thisBot.getOffset();

                    tags.homeX = offset ? xCoord + offset.x : xCoord;
                    tags.homeY = offset ? yCoord + offset.y : yCoord;
                `,
                form: processedData.previewImage.assetType[i] == "3D" ? "mesh" : processedData.previewImage.assetType[i] == "2D" ? "sprite" : "cube",
                formSubtype: processedData.previewImage.assetType[i] == "3D" ? "gltf" : null,
                formAddress: processedData.previewImage.assetType[i] == "json" ? null : processedData.previewImage.asset[i],
                home: false,
                homeX: offset.x ? xCoord + offset.x : xCoord,
                homeY: offset.y ? yCoord + offset.y : yCoord,
                tilesetsVisible: `@ tags.home == true ? tags.home = false : tags.home = true`,
                draggable: false,
                onClick: `@
                getBots(b => {
                    let tileType = b.tags.tileProperties ? b.tags.tileProperties.tileType : null;

                    if(tags[tileType]){
                        tags[tileType].asset || tags[tileType].extraMods ? setTag(b, "formAddress", tags[tileType].asset) : null;

                        if(b.tags.formAddress != null){
                            setTag(b, "color", null);
                            setTag(b, "label", null);
                        }
                        
                        if(tags[tileType].assetType == "3D"){
                            setTag(b, "form", "mesh");
                            setTag(b, "formSubtype", "gltf");
                            setTag(b, "scaleZ", null);
                        }
                        else if(tags[tileType].assetType == "2D"){
                            setTag(b, "form", "sprite");
                            setTag(b, "formSubtype", null);
                            setTag(b, "scaleZ", "0.01");
                        }
                        else if(tags[tileType].extraMods) {
                            setTag(b, "form", null);
                            setTag(b, "formSubtype", null);
                            setTag(b, "scaleZ", null);
                        }

                        tags[tileType].animationIdle ? setTag(b, "animationIdle", tags[tileType].animationIdle) : setTag(b, "animationIdle", null);
                        tags[tileType].toggleAsset ? setTag(b, "toggleAsset", tags[tileType].toggleAsset) : setTag(b, "animationIdle", null);

                        if(tags[tileType].extraMods){
                            for(const mod in tags[tileType].extraMods){
                                if(mod == "label" && b.tags.labelPosition && b.tags.labelPosition == "floatingBillboard"){
                                    null
                                }
                                else {
                                    setTag(b, mod, tags[tileType].extraMods[mod]);
                                }
                            }
                        }
                    }
                })

                shout("setCameraVariables", { "skipWait": true });
                shout("doSharedAction", { actionType: "playSound", actionData: "tilesetClicked" });
            `
            }

            for (const tile in processedData) {
                if (Array.isArray(processedData[tile])) {
                    imageSetBot[tile] = processedData[tile][i]
                }
                else {
                    let props = Object.entries(processedData[tile]);
                    imageSetBot[tile] = {};

                    for (const prop of props) {
                        imageSetBot[tile][prop[0]] = prop[1][i]
                    }
                }
            }

            console.log("imageSetBot", imageSetBot)

            if (processedData.previewImage.extraMods[i]) {
                create(imageSetBot, processedData.previewImage.extraMods[i])
            }
            else {
                create(imageSetBot)
            };
        }


    }
}
else {
    console.error("sheet grab error");
}