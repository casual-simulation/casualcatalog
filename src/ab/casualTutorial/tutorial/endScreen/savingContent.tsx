const Content = () => {
    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed "Saving Your Work"!</blockquote>
        <div className="left-align">
            In this section, you learned about:
            <ul>
                <li>Instances</li>
                <li>Downloading Bots</li>
                <li>Publishing Bots</li>
                <li>Hatching Eggs</li>
                <li>Actions
                    <ul>
                        <li>
                            <a href="https://docs.casualos.com/actions/barcodes/#os.showJoinCode" target="_blank">os.showJoinCode()</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <hr />

        <div className="left-align">
            <h2>Next, you can...</h2>
            <h3>🚶‍♂️ Move on</h3>
            <button className="btn" onClick={ () => handleChangeSequence("intro")}>
                Introduction
            </button>
            <button className="btn" onClick={ () => handleChangeSequence("interactions") }>
                Bot Interactions
            </button>
            <button className="btn" onClick={ () => handleChangeSequence("portals")}>
                Portals & Dimensions
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