//Creating a prompt menu
configBot.tags.menuPortal = "geoArtifactConfigMenu";

thisBot.resetGeoArtifactMenu();

let menuButton = {
    geoArtifact: getLink(thisBot),
    color: tags.artifactMenuButtonColor,
    geoArtifactTool: true,
    geoArtifactMenuReset: "@ destroy(thisBot)",
    geoArtifactConfigMenu: true,
}

const titleConfig = {
    ...menuButton,
    formAddress: tags.artifactLocked ? "" : "edit",
    label: (!tags.artifactLocked ? "title: " : " ") + (tags.artifactTitle ?? " "),
    onClick: `@
        if (!links.geoArtifact.tags.artifactLocked) {
            const newTitle = await os.showInput(links.geoArtifact.tags.artifactTitle || '', {
                title: 'Title this artifact'
            });

            links.geoArtifact.tags.artifactTitle = newTitle;
            
            links.geoArtifact.createGeoArtifactMenu();
        }
    `
}

const descriptionConfig = {
    ...menuButton,
    formAddress: tags.artifactLocked ? "" : "edit",
    label: (!tags.artifactLocked ? "story: " : "") + (tags.artifactDescription ?? ""),
    onClick: `@
        if (!links.geoArtifact.tags.artifactLocked) {
            const newDescription = await os.showInput(links.geoArtifact.tags.artifactDescription || '', {
                title: 'Tell this artifact's story'
            });

            links.geoArtifact.tags.artifactDescription = newDescription;
            
            links.geoArtifact.createGeoArtifactMenu();
        }
    `
}

const viewRecord = {
    ...menuButton,
    formAddress: tags.artifactLocked ? "" : "edit",
    label:  (!tags.artifactLocked ? "link: " + (tags.artifactLink ?? "") : "view record"),
    onClick: `@
            if (links.geoArtifact.tags.artifactLocked) {
                os.openURL(links.geoArtifact.tags.artifactLink);
            } 
            else {
                const newLink = await os.showInput(links.geoArtifact.tags.artifactLink || '', {
                    title: 'Link to this artifact'
                });

                links.geoArtifact.tags.artifactLink = newLink;
                
                links.geoArtifact.createGeoArtifactMenu();
            }`,
}

const geoLocation = {
    ...menuButton,
    formAddress: tags.artifactLocked ? "" : "edit",
    label: (!tags.artifactLocked ? "location: " : "") + (tags.longitude && tags.latitude ? tags.longitude + ", " + tags.latitude : ""),
    onClick: `@
        if (!links.geoArtifact.tags.artifactLocked) {
            const newLocation = await os.showInput(tags.longitude && tags.latitude ? tags.longitude + ", " + tags.latitude : "", {
                title: 'Provide location data: longitude,latitude'           
            });
            
            if(!newLocation) {
                return;
            }
            const curPortName = ab.links.remember.tags.abActiveDimension;
            links.geoArtifact.tags[curPortName + "X"] = newLocation.split(",")[0].replace(" ", "");
            links.geoArtifact.tags[curPortName + "Y"] = newLocation.split(",")[1].replace(" ", "");
            links.geoArtifact.updateLatitudeLongitude(curPortName);

            links.geoArtifact.createGeoArtifactMenu();
        }
    `
}

const lockUnlock = {
    ...menuButton,
    formAddress: "lock",
    label:  tags.artifactLocked ? "unlock" : "lock",
    onClick: `@
                links.geoArtifact.tags.artifactLocked = ${tags.artifactLocked ? false : true}; 
                links.geoArtifact.createGeoArtifactMenu();
                links.geoArtifact.tags.draggable = ${tags.artifactLocked ? true : false};`,
}

if (tags.artifactLocked) {
    titleConfig.onClick = null;
    descriptionConfig.onClick = null;
    titleConfig.pointable = false;
    descriptionConfig.pointable = false;

    if (!tags.artifactTitle) {
        titleConfig.label = "unknown";
    }
    if (!tags.artifactDescription) {
        descriptionConfig.label = "unknown";
    }

    ab.links.menu.abCreateMenuText(titleConfig);
    ab.links.menu.abCreateMenuText(descriptionConfig);
    ab.links.menu.abCreateMenuButton(viewRecord);
    ab.links.menu.abCreateMenuButton(lockUnlock);
} else {
    ab.links.menu.abCreateMenuButton(titleConfig);
    ab.links.menu.abCreateMenuButton(descriptionConfig);
    ab.links.menu.abCreateMenuButton(viewRecord);
    ab.links.menu.abCreateMenuButton(geoLocation);
    ab.links.menu.abCreateMenuButton(lockUnlock);
}

setTagMask(thisBot, "menuOpen", true, "tempLocal");