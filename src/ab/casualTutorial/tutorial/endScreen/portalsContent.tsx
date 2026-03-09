const { useEffect } = os.appHooks

const Content = () => {

    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed "Portals"!</blockquote>
        <div className="left-align">
            In this section, you learned about:
            <ul>
                <li>The Sheet Portal</li>
                <li>Dimensions</li>
                <li>Summoning ab-1</li>
                <li>Actions:
                    <ul>
                        <li>
                            <a href="https://docs.casualos.com/actions/portals/#os.goToDimension" target="_blank">
                                os.goToDimension()
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <hr />

        <div className="left-align">
            <h2>Next, you can...</h2>
            <h3>🔎 Go Deeper</h3>
            <button
                className="btn"
                style={{ marginBottom: "0.5rem" }}
                onClick={ () => handleChangeSequence("morePortals") }
            >
                More Portals
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