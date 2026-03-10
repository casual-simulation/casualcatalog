const { useState, useEffect } = os.appHooks;
const css = helper.compileCSS([ thisBot ])

const App = () => {
    const goHome = async () => {
        configBot.tags.mapPortal = ""
        os.goToDimension("home")
        whisper(thisBot, "hideGoHome")

        if (
        os.getCurrentDimension() == 'ab1'
        && stepManager.tags.sequence == 'portals'
        && stepManager.tags.step == 3) {
            shout('nextStep')
        }

        if (stepManager.tags.sequence == 'morePortals' && stepManager.tags.step == 2) {
            os.sleep(250).then(() => {
                shout ('executeDialogue', {sequence: 'morePortals', step: 2, dialogueIndex: 3})
            })
        }
    }

    return (
        <>
            <style>{css}</style>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <meta name="theme-color" content="#ffffff" />

            <div className="home-btn-container">
                <button onClick={goHome}>
                    <span className="left-arrow">👈</span>
                    Go Home
                </button>
            </div>
        </>
    )
}

return App
