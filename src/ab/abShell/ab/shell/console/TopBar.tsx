const offset = 8
const initialHeight = 256
const dragInterval = 25

const ButtonsBar = () => {

    const handleClose = () => {
        shout('hideConsole');
    }

    return (<>
        <div
            className="ab-console-top-bar"
        >

            <button
                className="ab-console-btn md-icon md-icon-font"
                onClick={handleClose}
                style={{
                    top: "8px",
                    right: "8px",
                    zIndex: 2,
                }}
            >
                close
            </button>
            
        </div>
    </>)
}

return ButtonsBar
