const App = () => {
    return (<>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div>
            <button className="gridHUD-toMap nb-btn"  id="button" onClick={thisBot.toMap}>
                <span>Back to Map</span>
            </button>
        </div>
    </>)
}

return App