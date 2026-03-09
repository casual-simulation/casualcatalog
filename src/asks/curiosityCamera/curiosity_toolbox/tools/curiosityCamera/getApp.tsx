let str=tags.discoverableURL;
const isValidUrl = urlString=> {
          var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
      return !!urlPattern.test(urlString);
}
let App = () => {
    return (<>
        <style>{tags['Camera.CSS']}</style>
        <div className="location-popup">
            <div className="location-popup-top-bar">
                <button className="location-popup-close-btn" onClick={() => thisBot.closeApp("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <div className="locationR-title">
                <span><br></br>{str}<br></br><br></br><br></br><br></br></span>
            </div>
            <div class="locationR-btn-container">
            </div>
        </div>

    </>)
}

if (str.includes("There are no matching objects") || str.includes("Analyzing"))
{
    App = () => {
        return (<>
            <style>{tags['Camera.CSS']}</style>
            <div className="location-popup">
                <div className="location-popup-top-bar">
                    <button className="location-popup-close-btn" onClick={() => thisBot.closeApp("x")}>
                        <span className="md-icon md-icon-font">close</span>
                    </button>
                                </div>
                <div className="locationR-title">
                    <span><br></br>{str}<br></br><br></br><br></br><br></br></span>
                </div>
                <div class="locationR-btn-container">
                </div>
            </div>

        </>)
    }
}
else if (isValidUrl(str))
{
    App = () => {
        return (<>
            <style>{tags['Camera.CSS']}</style>
            <div className="location-url-popup">
                <div className="location-popup-top-bar">
                    <button className="location-popup-close-btn" onClick={() => thisBot.closeApp("x")}>
                        <span className="md-icon md-icon-font">close</span>
                    </button>
                </div>
                <div className="location-url-iframe">
                    <iframe src={str} height="800" width="600"></iframe> 
                </div>
            </div>
        </>)
    }
}
else
{
    App = () => {
        return (<>
            <style>{tags['Camera.CSS']}</style>
            <div className="location-popup">
                <div className="location-popup-top-bar">
                    <button className="location-popup-close-btn" onClick={() => thisBot.closeApp("x")}>
                        <span className="md-icon md-icon-font">close</span>
                    </button>
                                </div>
                <div className="locationR-title">
                    <span><br></br>Landmark identified! However, the webpage cannot be found, please try again!<br></br><br></br><br></br><br></br></span>
                </div>
                <div class="locationR-btn-container">
                </div>
            </div>

        </>)
    }
}
return App