const { useEffect } = os.appHooks

const Content = () => {

    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed "More Portals"!</blockquote>
        <div className="left-align">
            In this section, you learned about the:
            <ul>
                <li>Menu Portal</li>
                <li>Map Portal</li>
                <li>Mini-Map Portal</li>
                <li>Mini-Grid Portal</li>
                <li>System Portal</li>
            </ul>
            There are even more portals, and you can learn about them by scrolling through the <a href="https://docs.casualos.com/tags/#gridportal" target="_blank">configBot docs</a>
        </div>

        <hr />

        <div className="left-align">
            <h2>Next, you can...</h2>
            <h3>⏎ Go Back</h3>
            <button
                className="btn"
                style={{ marginBottom: "0.5rem" }}
                onClick={ () => handleChangeSequence("portals") }
            >
                Portals & Dimensions
            </button>

            <h3>🚶‍♂️ Move on</h3>
            <button className="btn" onClick={ () => handleChangeSequence("intro")}>
                Introduction
            </button>
            <button className="btn" onClick={ () => handleChangeSequence("interactions")}>
                Bot Interactions
            </button>
            <button className="btn" onClick={ () => handleChangeSequence("saving")}>
                Saving Your Work
            </button>

            <h3>📖 Read More</h3>
            <button className="btn" onClick={ () => os.openURL("https://docs.casualos.com/tags")} >
                Read the Docs
            </button>
        </div>
      </div>
    )
}

return Content