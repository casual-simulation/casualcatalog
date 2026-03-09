const App = () => {
    return (<>
        <style>{tags["App.css"]}</style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div className="info-container">
            <div className="info-top-bar">
                <button className="info-launchInteractive" id={(tags.itemInteractive) ? "interact" : "noInteract"} onClick={() => thisBot.launchInteractive()}>
                    <span className="md-icon md-icon-font">extension</span>
                    {(tags.itemInteractive) ? "Launch Interactive" : ""}
                </button>
                <button className="info-close-btn" onClick={() => thisBot.closeApp("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <span className="info-itemName">{tags.itemName}</span>
            <span className="info-itemYear">{(tags.itemYear) ? "Year " + tags.itemYear : " "}</span>
            <div id="imageDiv"><img className="info-img" src={tags.imageSrc} alt="Image of Artifact" /></div>
            <br />
            <span className="info-scroll">{tags.itemInfo}</span>
            <a className="info-grpm-link" href={tags.itemLink} target="_blank" rel="noopener noreferrer"><span>{(tags.itemLink) ? "GRPM Digital Collection" : ""}</span></a>
        </div>
    </>)
}

return App