const { useState, useEffect } = os.appHooks;
const css = helper.compileCSS([ thisBot ])

const Header = thisBot.Header()
const HelpViewer = thisBot.HelpViewer()
const HelpEditor = thisBot.HelpEditor()

const App = () => {
    const [editing, setEditing] = useState(false)

    const [sequence,] = useState(stepManager.tags.sequence)
    const [step,] = useState(stepManager.tags.step)
    const [developing,] = useState(tags.developing)

    const [helpArray, setHelpArray] = useState(tags[`${sequence}Help`])
    const [savedHelpString, setSavedHelpString] = useState('')

    useEffect(() => {
        if (!Array.isArray(helpArray)) {
            tags[`${sequence}Help`] = `🧬[]`
            setHelpArray([])
        }
    }, [])

    const updateHelpArray = (e) => {
        setSavedHelpString(e.target.value)
    }

    const toggleEditing = () => {
        if (editing && savedHelpString[0] == '<') {
            var _helpArray = helpArray
            _helpArray[step - 1] = savedHelpString

            setHelpArray([..._helpArray])
            tags[`${sequence}Help`] = [..._helpArray]
        }

        setEditing(current => {
            return !current
        });
    };

    return (
        <>
            <style>{css}</style>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <meta name="theme-color" content="#ffffff" />

            <div className="help-container">
                <div className="close-click-target" onClick={() => shout('closeHelp')} />
                <div className="help-modal">
                    <Header />
                    <div className="help-body">
                        {editing
                        ? <HelpEditor sequence={sequence} step={step} helpArray={[...helpArray]} updateHelpArray={updateHelpArray} />
                        : <HelpViewer sequence={sequence} step={step} helpArray={[...helpArray]} />}
                    </div>
                    { developing && <button className="edit-btn remove-btn-style md-fab" onClick={toggleEditing}>
                        <i className="material-icons md-24">{editing ? 'done' : 'edit'}</i>
                    </button> }
                </div>
            </div>
        </>
    )
}

return App
