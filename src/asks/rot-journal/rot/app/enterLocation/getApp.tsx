let App = () => {
    return (<>
        <div className="move-location-popup">
            <div className="location-popup-top-bar">
                <button className="location-popup-close-btn" onClick={() => thisBot.closeAppShowUI("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <div className="locationR-title">
                <span>Would you like to enter the {that} building?</span>
            </div>
            <div class="locationR-btn-container">
                <button className="nb-btn locationR-btn" onClick={() => thisBot.enterBuilding()}>
                    <span>Yes</span>
                </button>
                <button className="nb-btn locationR-btn" onClick={() => thisBot.closeAppShowUI()}>
                    <span>No</span>
                </button>
            </div>
        </div>
    </>)
}
return App