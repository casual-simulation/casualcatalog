const App = () => {
    return (<>
        <style>{tags["App.css"]}</style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div className="debug-container">
            <div className="debug-top-bar">
                
                <button className="debug-icon">
                    <span className="md-icon md-icon-font">bug_report</span>
                    Debug
                </button>
                <button className="debug-close-btn" onClick={() => thisBot.closeApp()}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <table className="debug-table">
                <tr>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 1)}>
                            <span>1</span>
                        </div>
                    </td>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 2)}>
                            <span>2</span>
                        </div>
                    </td>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 3)}>
                            <span>3</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 4)}>
                            <span>4</span>
                        </div>
                    </td>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 5)}>
                            <span>5</span>
                        </div>
                    </td>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 6)}>
                            <span>6</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 7)}>
                            <span>7</span>
                        </div>
                    </td>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 8)}>
                            <span>8</span>
                        </div>
                    </td>
                    <td className="debug-cell">
                        <div className="debug-cell-contents" onClick={() => shout("changeItemState", 9)}>
                            <span>9</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </>)
}

return App