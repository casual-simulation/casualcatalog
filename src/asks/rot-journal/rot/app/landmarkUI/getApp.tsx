const App = () => {
    return (<>
        <style>{tags["App.css"]}</style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div className="landmark-container">
            <div className="landmark-top-bar">
                <a href={(masks.landmarkInteractive != null) ? masks.landmarkInteractive : null} target="_blank" rel="noopener noreferrer" style={{"text-decoration":"none"}}>
                    <button className="landmark-launchInteractive" id={(masks.landmarkInteractive != null) ? "interact" : "noInteract"} onClick={() => thisBot.launchInteractive()}>
                        <span className="md-icon md-icon-font">play_circle</span>
                        {(masks.landmarkInteractive != null) ? "Launch Video" : ""}
                    </button>
                </a>
                <button className="landmark-close-btn" onClick={() => thisBot.closeApp("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <span className="landmark-landmarkName">{masks.landmarkName}</span>
            <span className="landmark-landmarkCoord">Lat: {masks.landmarkLat}   Long: {masks.landmarkLong}</span>
            <div className={(masks.imageSrc != null) ? "imageDiv" : "noDisplay"}><img className={(masks.imageSrc != null) ? "landmark-img" : "noDisplay"} src={masks.imageSrc} alt="Image of Landmark" /></div>
            <div className={(masks.videoSrc != null) ? "videoDiv" : "noDisplay"}><iframe src={masks.videoSrc} style={{"border":"none", "height":"100%", "width":"100%", "display":"block", "margin":"auto"}}></iframe></div>
            <br />
            <span className="landmark-scroll">{masks.landmarkInfo}</span>
        </div>
    </>)
}

return App