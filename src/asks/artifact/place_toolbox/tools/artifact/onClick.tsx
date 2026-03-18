if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout('clearArtifactMenu');

configBot.tags.menuPortal = 'artifact_menu';

const menuOptions = {
    artifact_menu: true,
    clearArtifactMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    art: getLink(thisBot)
}

const nameButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'name this artifact',
    artifact_menuSortOrder: 1,
    onClick: `@
        const newName = await os.showInput(links.art.tags.artifactName ?? '', {
        autoSelect: true,
        title: 'Name this artifact'
    });

    links.art.tags.artifactName = newName;
    links.art.tags.label = newName;
    
    links.art.onClick();
    `
}

const descButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'add a description',
    artifact_menuSortOrder: 2,
    onClick: `@
        const newDesc = await os.showInput(links.art.tags.artifactDescription ?? '', {
        autoSelect: true,
        title: 'describe this artifact'
    });

    links.art.tags.artifactDescription = newDesc;
    links.art.onClick();
    `
}

const landmarkButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'add a landmark',
    artifact_menuSortOrder: 3,
    onClick: `@
        const newLand = await os.showInput('', {
        autoSelect: true,
        title: 'provide a landmarkID'
    });

    links.art.addLandmark(newLand);
    links.art.onClick();
    `
}

const collectionButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'provide a collection ID',
    artifact_menuSortOrder: 4,
    onClick: `@
        const newID = await os.showInput(links.art.tags.collectionID ?? '', {
        autoSelect: true,
        title: 'provide a collectionID'
    });

    links.art.collectionID = newID;
    links.art.onClick();
    `
}

const imageButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'provide an image',
    artifact_menuSortOrder: 5,
    onClick: `@
        const newImg = await os.showInput('', {
        autoSelect: true,
        title: 'provide an image'
    });

    links.art.tags.artifactImage = newImg;
    links.art.tags.formAddress = newImg;
    links.art.tags.form = "sprite";
    links.art.orientationMode = 'billboard';
    links.art.onClick();
    `
}

const addLinkButton = {
    ...menuOptions,
    formAddress: 'link',
    label: 'add a link',
    artifact_menuSortOrder: 6,
    onClick: `@
        const link = await os.showInput(links.art.tags.artifactLink ?? '', {
        autoSelect: true,
        title: 'add a link'
    });
    
    links.art.tags.artifactLink = link;
    
    links.art.onClick();
    `
}

const lockButton = {
    ...menuOptions,
    formAddress: 'lock',
    label: 'lock artifact',
    artifact_menuSortOrder: 100,
    onClick: `@
        links.art.tags.artifactLocked = true;
        links.art.onClick();
    `
}

const nameTag = {
    ...menuOptions,
    label: tags.artifactName,
    color: ab.links.personality.tags.abBaseMenuColor,
    artifact_menuSortOrder: 1
}

const descTag = {
    ...menuOptions,
    label: tags.artifactDescription,
    color: ab.links.personality.tags.abBaseMenuColor,
    artifact_menuSortOrder: 2
}

const yearTag = {
    ...menuOptions,
    label: 'year: ' + tags.artifactYear,
    color: ab.links.personality.tags.abBaseMenuColor,
    artifact_menuSortOrder: 3
}

const visitLinkButton = {
    ...menuOptions,
    formAddress: 'link',
    label: tags.artifactLink,
    artifact_menuSortOrder: 5,
    onClick: `@
        os.openURL(links.art.tags.artifactLink);
        shout('clearArtifactMenu');
    `
}

const collectButton = {
    ...menuOptions,
    label: 'collect',
    artifact_menuSortOrder: 6,
    onClick: `@
        links.art.collect();
        shout('clearArtifactMenu');
    `
}

if (!tags.artifactLocked) {
    ab.links.menu.abCreateMenuButton(nameButton);
    ab.links.menu.abCreateMenuButton(descButton);
    ab.links.menu.abCreateMenuButton(landmarkButton);
    ab.links.menu.abCreateMenuButton(collectionButton);
    ab.links.menu.abCreateMenuButton(imageButton);
    ab.links.menu.abCreateMenuButton(addLinkButton);
    ab.links.menu.abCreateMenuButton(lockButton);

} else {
    // ab.links.menu.abCreateMenuText(nameTag);
    // if (tags.artifactDescription) {
    //     ab.links.menu.abCreateMenuText(descTag);
    // }
    // if (tags.artifactYear) {
    //     ab.links.menu.abCreateMenuText(yearTag);
    // }
    // if (tags.artifactLink) {
    //    ab.links.menu.abCreateMenuButton(visitLinkButton); 
    // }
    ab.links.menu.abCreateMenuButton(collectButton);
}
