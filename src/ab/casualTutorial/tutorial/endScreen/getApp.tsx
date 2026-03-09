const { useState, useEffect } = os.appHooks;
const css = helper.compileCSS([ thisBot ])
os.log("Getting end screen for", that.sequence)
const Confetti = thisBot.Confetti()
const Content = thisBot[`${that.sequence}Content`]()

const App = () => {

    return (
        <>
            <style>{css}</style>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <meta name="theme-color" content="#ffffff" />

            <div className="screen-container">
                <div className="wrapper">
                    <Confetti />
                </div>
                
                <div className="close-click-target" onClick={() => shout('closeEnd')} />
                <div className="modal">
                    <div className="modal-content">
                        <h1>🎉 Congratulations! 🎉</h1>
                        <hr />
                        <Content />
                    </div>
                </div>
            </div>
        </>
    )
}

return App
