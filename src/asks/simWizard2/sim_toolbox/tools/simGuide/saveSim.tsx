//create and save all page eggs
const pageBots = getBots(byTag("simEditor", true));

for (const page of pageBots) {

    //make simPageHandler
    const abArtifactShard = {
        data: {
            pageID: page.tags.pageID,
            simID: tags.simID,
            prevPage: page.tags.prevPage,
            nextPage: page.tags.nextPage,
            eggParameters: {
                gridInformation: {
                    dimension: 'home',
                    position: {
                        x: -10,
                        y: 10
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'simPageHandler'
            }
        ]
    };
    const handler = await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: "simPageHandler",
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    await os.sleep(0);

    //grab associated tools
    let allPageInfo = getBots(page.tags.pageID, true);
    allPageInfo.push(handler[0]);

    //publish as simID_pageID
    try {
        const studio = configBot.tags.studio ?? authBot.id;
        const publishAttempt = await ab.links.store.abPublishAB({ab: tags.simID + '_' + page.tags.pageID, target: allPageInfo, sourceEvent: 'pattern_update', studio: studio, publicFacing: true});

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
        }

        if (!publishAttempt.success) {
            const permissions = await os.grantInstAdminPermission(studio);

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] saveData permissions:`, permissions);
            }

            const secondPublishAttempt = await ab.links.store.abPublishAB({ab: uuabName, target: uuabEgg, sourceEvent: 'uuab_egg_publish', studio: studio, publicFacing: true});
                
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}]  saveData publishAttempt 2`, secondPublishAttempt);
            }

            if (!secondPublishAttempt.success){
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] Could not publish`, secondPublishAttempt);
                }
                os.toast("could not publish");
            } else {
                os.toast("Publishing successful");
                ab.links.manifestation.abSetAwake({ awake: true });
            }
        } else {
            os.toast("Publishing successful");
        }
    } catch (e) {
        console.log(`[${tags.system}.${tagName}]: issue publishing uuab`, e);
        //delete egg
        destroy(handler);
    }

    destroy(handler);   
}