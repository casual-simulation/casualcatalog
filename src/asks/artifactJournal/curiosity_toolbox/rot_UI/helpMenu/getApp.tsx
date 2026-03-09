let hudBot = getBot(byTag("name", "hudMenu"));
let locationBot = getBot(byTag("name", "locationRequest"));
let playerBot = getBot(byTag("artifactJournal", true))
let locationToggled= playerBot.tags.continueLocationPull ?? false;
const App = () => {
    return (<>
        <style>{tags["App.css"]}</style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div className="help-container">
            <div className="help-top-bar">
                <button className="help-close-btn" onClick={() => thisBot.closeApp("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <span className="help-title">How to Play</span>
            <span className="help-scroll">
                Travel to different locations and collect artifacts!<br/><br/>
                All collected artifacts can be viewed in their specific Collections in the Journal.<br/>
                Some artifacts even have special interactive games that can be accessed on their Info pages!
            </span>
            <div className="camera-toggle-text">
                Location enabled
                <label class="switch">
                {
                    locationToggled == false ? <input type="checkbox" onChange={e => thisBot.locationToggle(e.target.checked)}/>
                    : <input type="checkbox" checked onChange={e => thisBot.locationToggle(e.target.checked)}/>
                }
                    <span class="cameraSlider"></span>
                </label>
            </div>
        </div>

    </>)
}

return App