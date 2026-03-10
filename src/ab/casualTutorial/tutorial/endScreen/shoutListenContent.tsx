const { useEffect } = os.appHooks

const Content = () => {

    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed "Shouts & Listens"!</blockquote>
        <div className="left-align">
            In this section, you learned all about how bots can communicate to one another.
            <ul className="">
                <li><a href="https://docs.casualos.com/actions/#shoutname-arg" target="_blank">Shouting</a></li>
                <li><a href="https://docs.casualos.com/listen-tags/" target="_blank">Listening</a></li>
                <li><a href="https://docs.casualos.com/actions/#getbottag-filter" target="_blank">Getting Bots</a></li>
                <li><a href="https://docs.casualos.com/actions/#whisperbot-name-arg" target="_blank">Whispering</a></li>
            </ul>
        </div>

        <hr />

        <div className="left-align">
            <h2>Next, you can...</h2>
            <h3>⏎ Go Back</h3>
            <button
                className="btn"
                style={{ marginBottom: "0.5rem" }}
                onClick={ () => handleChangeSequence("interactions") }
            >
                Bot Interactions
            </button>

            <h3>🚶‍♂️ Move on</h3>
            <button className="btn" onClick={ () => handleChangeSequence("intro") }>
                Introduction
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