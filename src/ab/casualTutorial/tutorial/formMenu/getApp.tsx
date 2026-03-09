const { useState, useEffect } = os.appHooks;
const css = helper.compileCSS([ thisBot ])

const App = () => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setOpen(true)
        }, 10)
    }, [])
    
    const changeForm = (form) => {
        const selectedBot = getBot(byID(tags.selectedBot))
        selectedBot.tags.form = form
        setTimeout(() => {
            shout('closeFormMenu')
        }, 900)
    }

    const closeApp = () => {
        setTimeout(() => {
            shout('closeFormMenu')
        }, 900)
    }


    return (
        <>
            <style>{css}</style>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

            <div className="menu">
            <input type="checkbox" id="toggle" checked={open} />
            <label id="show-menu" for="toggle">
                <div className="btn" onClick={closeApp}>
                    <i className="material-icons md-36 toggleBtn menuBtn">close</i>
                    <i className="material-icons md-36 toggleBtn closeBtn">close</i>
                </div>
                <div className="btn" onClick={() => changeForm('cube')}>
                    cube
                </div>
                <div className="btn" onClick={() => changeForm('sphere')}>
                    sphere
                </div>
                <div className="btn" onClick={() => changeForm('hex')}>
                    hex
                </div>
                <div className="btn" onClick={() => changeForm('circle')}>
                    circle
                </div>
                <div className="btn" onClick={() => changeForm('helix')}>
                    helix
                </div>
                <div className="btn" onClick={() => changeForm('egg')}>
                    egg
                </div>
            </label>
            </div>
        </>
    )
}

return App
