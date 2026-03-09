const { useState, useEffect } = os.appHooks;
let App = () => {
    const [isLoggedIn, setLogin] = useState(masks.loggedin);
    const [isSaving, setSaving] = useState(masks.currentlySaving);
    if (isSaving && isLoggedIn)
    {
        tags.justSaved=true
    }
    else if (tags.justSaved)
    {
        tags.justSaved=false
        os.toast("Progress Saved!")
    }
    useEffect(() => {
        thisBot.vars.onLoginUpdate = (newIsLoggedIn) => { setLogin(newIsLoggedIn) }
        return () => { thisBot.vars.onLoginUpdate = null }
    }, []);
    useEffect(() => {
        thisBot.vars.onSaveUpdate = (newSaving) => { setSaving(newSaving) }
        return () => { thisBot.vars.onSaveUpdate = null }
    }, []);

    return (<>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

        {
                <div>
                    <button className="journal-open nb-btn" id="button" onClick={thisBot.openJournal}>
                        <span>Collections</span>
                    </button>
                    <p id="camToggle"></p>
                    {
                        tags.cameraToggle == true ?
                            <button className="camera-btn" id="button" onClick={thisBot.openCamera}>
                                <span class="material-symbols-outlined">photo_camera</span>
                            </button>
                            : ''
                    }
                    <button className="journal-help nb-btn" id="button" onClick={thisBot.openHelp}>
                        <span>?</span>
                    </button>
                    <button class="nb-btn locationR-mini-icon-btn" onClick={() => { thisBot.openLocationApp() }}>
                        <span class="material-symbols-outlined">explore</span>
                    </button>
                    <button className="journal-login" id={(isLoggedIn) ? "notClickable" : "clickable"} onClick={thisBot.login}>
                    </button>
                </div>
        }
        
    </>)
}
return App