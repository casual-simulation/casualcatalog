let artifactBot = getBot(byTag("artifactJournal", true));

function getItems() {
    const elems = [];
    for (let i = 0; i < artifactBot.tags.collectableIDs.length; ++i) {
        let numFound = 0;
        for (let id of artifactBot.tags.collectableIDs[i]){
            if (artifactBot.tags.userData.collectedArtifacts.find(item => item.id == id)?.state == "collected") numFound++;
        }
        
        const collectionData = artifactBot.tags.collectionsInfo[i]?.attributes;

        let hide = collectionData.ShowInMenu == true ? false : (numFound == 0) ? true : false;

        if (hide) {
            continue;
        }
        
        elems.push(<button className="nb-btn collectionsM-btn" id="unlocked" onClick={numFound > 0 ? () => thisBot.openCollection(1) : () => {}}>
                    <span>{(numFound > 0) ? collectionData.Name : "Undiscovered"}</span>
                    <div className="collectionsM-progressbar">
                        <div id={numFound > 0 ? "collectionsM-progressbar-" + Math.round(numFound/artifactBot.tags.collectableAmounts[1] * 10) : "collectionsM-progressbar-0"}>
                            {(numFound > 0) ? numFound + "/" + artifactBot.tags.collectableAmounts[1] : "?/?"}
                        </div>
                    </div>
                </button>)
    }
    return elems;
}

const App = () => {
    const collections = getItems();

    return (<>
        <div className="collectionsM-container">
            <div className="collectionsM-top-bar">
                <button className="journal-help" id="button" onClick={thisBot.openHelp}>
                    <span>?</span>
                </button>
                <button className="collectionsM-close-btn" onClick={() => thisBot.closeApp("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <div className="collectionsM-list-container">
                <span className="collectionsM-noneFound" id={(collections.length > 0) ? "hidden" : "found"}>You haven't unlocked any collections, yet. Try searching for artifacts at different landmarks!</span>
                {collections}
            </div>
        </div>
    </>)
}

return App

// <button class="nb-btn locationR-mini-icon-btn" onClick={() => { thisBot.openLocationApp() }}>
//     <span class="material-symbols-outlined">explore</span>
// </button>
// <button className="journal-login" id={(isLoggedIn) ? "notClickable" : "clickable"} onClick={thisBot.login}>
// </button>