let artifactBot = getBot(byTag("artifactJournal", true));

const {useState, useEffect} = os.appHooks;

const App = () => {
    const [collectionsCompletion, setCompletion] = useState(tags.collectionsCompletion);

    useEffect(() => {
        thisBot.vars.onCompletionUpdate = (newCompletion) => {setCompletion(newCompletion)}
        return () => {thisBot.vars.onCompletionUpdate = null}
    }, []);

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
            <span className="collectionsM-noneFound" id={(collectionsCompletion?.some(x => x > 0)) ? "hidden" : "found"}>You haven't unlocked any collections, yet. Try searching for artifacts at different landmarks!</span>
            <button className="nb-btn collectionsM-btn" id={(collectionsCompletion[0] == 0 || collectionsCompletion[0] == null) ? "hidden" : "unlocked"} onClick={() => thisBot.openCollection(0)}>
                <span>{(tags.collectionsAvailability[0] == "unlocked") ? artifactBot.tags.collectionNames[0] : ((tags.collectionsAvailability[0] == "locked") ? "Undiscovered" : "Coming "+ tags.collectionsAvailability[0])}</span>
                <div className="collectionsM-progressbar">
                    <div id={(tags.collectionsAvailability[0] == "unlocked") ? "collectionsM-progressbar-" + Math.round(collectionsCompletion[0]/artifactBot.tags.collectableAmounts[0] * 10) : "collectionsM-progressbar-0"}>{(tags.collectionsAvailability[0] == "unlocked") ? collectionsCompletion[0] + "/" + artifactBot.tags.collectableAmounts[0] : "?/?"}</div>
                </div>
            </button>
            <button className="nb-btn collectionsM-btn" id={(collectionsCompletion[1] == 0 || collectionsCompletion[1] == null) ? "hidden" : "unlocked"} onClick={() => thisBot.openCollection(1)}>
                <span>{(tags.collectionsAvailability[1] == "unlocked") ? artifactBot.tags.collectionNames[1] : ((tags.collectionsAvailability[1] == "locked") ? "Undiscovered" : "Coming "+ tags.collectionsAvailability[1])}</span>
                <div className="collectionsM-progressbar">
                    <div id={(tags.collectionsAvailability[1] == "unlocked") ? "collectionsM-progressbar-" + Math.round(collectionsCompletion[1]/artifactBot.tags.collectableAmounts[1] * 10) : "collectionsM-progressbar-0"}>{(tags.collectionsAvailability[1] == "unlocked") ? collectionsCompletion[1] + "/" + artifactBot.tags.collectableAmounts[1] : "?/?"}</div>
                </div>
            </button>
            <button className="nb-btn collectionsM-btn" id={(collectionsCompletion[2] == 0 || collectionsCompletion[2] == null) ? "hidden" : "unlocked"} onClick={() => thisBot.openCollection(2)}>
                <span>{(tags.collectionsAvailability[2] == "unlocked") ? artifactBot.tags.collectionNames[2] : ((tags.collectionsAvailability[2] == "locked") ? "Undiscovered" : "Coming "+ tags.collectionsAvailability[2])}</span>
                <div className="collectionsM-progressbar">
                    <div id={(tags.collectionsAvailability[2] == "unlocked") ? "collectionsM-progressbar-" + Math.round(collectionsCompletion[2]/artifactBot.tags.collectableAmounts[2] * 10) : "collectionsM-progressbar-0"}>{(tags.collectionsAvailability[2] == "unlocked") ? collectionsCompletion[2] + "/" + artifactBot.tags.collectableAmounts[2] : "?/?"}</div>
                </div>
            </button>
            <button className="nb-btn collectionsM-btn" id={(collectionsCompletion[3] == 0 || collectionsCompletion[3] == null) ? "hidden" : "unlocked"} onClick={() => thisBot.openCollection(3)}>
                <span>{(tags.collectionsAvailability[3] == "unlocked") ? artifactBot.tags.collectionNames[3] : ((tags.collectionsAvailability[3] == "locked") ? "Undiscovered" : "Coming "+ tags.collectionsAvailability[3])}</span>
                <div className="collectionsM-progressbar">
                    <div id={(tags.collectionsAvailability[3] == "unlocked") ? "collectionsM-progressbar-" + Math.round(collectionsCompletion[3]/artifactBot.tags.collectableAmounts[3] * 10) : "collectionsM-progressbar-0"}>{(tags.collectionsAvailability[3] == "unlocked") ? collectionsCompletion[3] + "/" + artifactBot.tags.collectableAmounts[3] : "?/?"}</div>
                </div>
            </button>
        </div>
    </>)
}

return App

// <button class="nb-btn locationR-mini-icon-btn" onClick={() => { thisBot.openLocationApp() }}>
//     <span class="material-symbols-outlined">explore</span>
// </button>
// <button className="journal-login" id={(isLoggedIn) ? "notClickable" : "clickable"} onClick={thisBot.login}>
// </button>