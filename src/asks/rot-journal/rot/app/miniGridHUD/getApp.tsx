const App = () => {
    return (<>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div>
            <div className="miniGrid-top-bar">
                <button className="miniGrid-button" id="button" onClick={thisBot.openFullGrid}>
                    <span className="md-icon md-icon-font">zoom_out_map</span>
                    Fullscreen
                </button>
                <button className="miniGrid-button" id="button" onClick={thisBot.closeSideInst}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
        </div>
    </>)
}

return App