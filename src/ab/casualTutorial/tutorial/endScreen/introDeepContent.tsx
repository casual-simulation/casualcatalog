const { useEffect } = os.appHooks

const Content = () => {

    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed "Sprites & Meshes"!</blockquote>
        <div className="left-align">
            In this section, you learned about:
            <ul>
                <li>Sprites</li>
                <li>Meshes</li>
                <li>Tags:
                    <ul>
                        <li>
                            <a href="https://docs.casualos.com/tags/#form" target="_blank">#form</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/tags/#formsubtype" target="_blank">#formSubtype</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/tags/#formaddress" target="_blank">#formAddress</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/tags/#formanimation" target="_blank">#formAnimation</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <hr />

        <div className="left-align">
            <h2>Next, you can...</h2>
            <h3>⏎ Go Back</h3>
            <button
                className="btn"
                style={{ marginBottom: "0.5rem" }}
                onClick={ () => handleChangeSequence("intro") }
            >
                Introduction
            </button>

            <h3>🚶‍♂️ Move on</h3>
            <button className="btn" onClick={ () => handleChangeSequence("interactions") }>
                Bot Interactions
            </button>
            <button className="btn" onClick={ () => handleChangeSequence("portals")}>
                Portals & Dimensions
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