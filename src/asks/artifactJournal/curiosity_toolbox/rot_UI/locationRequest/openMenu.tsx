/*
 * Returns the allow/deny menu for location
*/
const { useState, useEffect } = os.appHooks;
const journal = getBot("artifactJournal", true);

const App = () => {
    return (<>
        <div className="locationR-container">
            <div className="locationR-top-bar">
                <button className="locationR-close-btn" onClick={() => thisBot.closeApp()}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <div className="locationR-title">
                <span>Would you like to enable location?</span>
            </div>
            <div class="locationR-btn-container">
                <button className="nb-btn locationR-btn" onClick={() => journal.toggleLocationPull(true)}>
                    <span>Allow</span>
                </button>
                <button className="nb-btn locationR-btn" onClick={() => journal.toggleLocationPull(false)}>
                    <span>Deny</span>
                </button>
            </div>
        </div>
    </>)
}

return App