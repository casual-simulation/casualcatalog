const { useState, useEffect } = os.appHooks;

const App = () => {
    return (<>
        <div className="locationR-container">
            <div className="locationR-top-bar">
                <button className="locationR-close-btn" onClick={() => thisBot.closeApp()}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <div className="locationR-title">
                <span>Awaiting Permission...</span>
            </div>
        </div>
    </>)
}

return App