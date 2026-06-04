if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'place_portal_inst_menu';

const BASE_MENU_TAGS = {
    place_portal_inst_menu: true,
    clearPlacePortalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

//INST CHOICE
const instGroup = {
    ...BASE_MENU_TAGS,
    groupSortOrder: 1,
    menuItems: []
} 

let instList = await os.listInsts(tags.studioId ?? configBot.tags.studio ?? authBot?.id);

if (instList.success) {
    const insts = instList.insts;
    for (let i = 0; i < insts.length; ++i) {
        if (insts[i].markers?.includes("private") && insts[i].inst != os.getCurrentInst()) {
            instGroup.menuItems.push( {
                ...BASE_MENU_TAGS,
                label: insts[i].inst,
                instData: insts[i],
                formAddress: 'https://auth-aux-prod-filesbucket-682397690660.s3.amazonaws.com/64beb439-12b9-4155-b388-db03b7ec1c9c/b420a437d46113ec17929f3577909c88366f2d568f7734ea43f573fb53e2d1e8.png',
                onClick: `@
                    links.place.tags.instSetting = tags.instData.inst;
                    links.place.createURL();
                    shout('clearPlacePortalMenu');
                `
            })
        }
    }
}


const inny = await ab.links.menu.abCreateMenuGroup(instGroup);

console.log(configBot.tags.menuPortal, instGroup, inny)