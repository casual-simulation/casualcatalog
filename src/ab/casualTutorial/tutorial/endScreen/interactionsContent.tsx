const { useEffect } = os.appHooks

const Content = () => {

    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed "Bot Interactions"!</blockquote>
        <div className="left-align">
            In this section, you secretly learned how to program in
            <a href="https://www.w3schools.com/js/default.asp" target="_blank">JavaScript</a>!
            <p>You also learned about:</p>
            <ul className="u-flex u-block-xs">
                <li>Listen Tags
                    <ul>
                        <li><a href="https://docs.casualos.com/listen-tags#onclick" target="_blank">@onClick</a></li>
                        <li><a href="https://docs.casualos.com/listen-tags#onpointerenter" target="_blank">@onPointerEnter</a></li>
                        <li><a href="https://docs.casualos.com/listen-tags#onpointerexit" target="_blank">@onPointerExit</a></li>
                        <li><a href="https://docs.casualos.com/listen-tags#onpointerdown" target="_blank">@onPointerDown</a></li>
                        <li><a href="https://docs.casualos.com/listen-tags#onPointerUp" target="_blank">@onPointerUp</a></li>
                        <li><a href="https://docs.casualos.com/listen-tags#onKeyDown" target="_blank">@onKeyDown</a></li>
                    </ul>
                </li>
                <li className="ml-4 ml-0-xs">Actions
                    <ul>
                        <li>
                            <a href="https://docs.casualos.com/actions/#ostoastmessage-duration" target="_blank">os.toast()</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/actions/#ostipmessage-pixelx-pixely-duration" target="_blank">os.tip()</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/actions/#osshowinputvalue-options" target="_blank">os.showInput()</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/actions/#animatetagbot-tag-options" target="_blank">animateTag()</a>
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
                onClick={ () => handleChangeSequence("shoutListen") }
            >
                Shouts & Listens
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