const { useEffect } = os.appHooks

const Content = () => {
    // Load the meshes for going deeper
    useEffect(() => {
        // Table
        os.bufferFormAddressGLTF('https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/89c3e1f65855e724a8a061a790e91e42e6772466389a280d0d171ce6e3922933.xml')
        // Pizza
        os.bufferFormAddressGLTF('https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/7f9efb8ea8b6cc6641946c89bd3a39b05435ef65450104ce6ee206df475ab043.xml')
        // Soda
        os.bufferFormAddressGLTF('https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/89ef890be5c3719f0bd883b1107576a5d4296d30c8203dc84cd8da207d3c8b31.xml')
        // Sushi
        os.bufferFormAddressGLTF('https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/b4b1743623b395209ba320b394c0602c19c19fc4a13c9400210839aa4a0a1b37.xml')
        // Fox
        os.bufferFormAddressGLTF('https://publicos-link-filesbucket-404655125928.s3.amazonaws.com/ab-1/a0c5e0cfe5bd5f1be882dadc8dec523538b9cf32a1e0ab48b5735c5c296617a8.xml')
    }, [])

    const handleChangeSequence = (sequence) => {
        shout("changeSequence", {sequence: sequence})
        shout("closeEnd")
    }

    return (
      <div>
        <blockquote>You have completed the introduction!</blockquote>
        <div className="left-align">
            In this section, you learned about:
            <ul>
                <li>Moving Bots</li>
                <li>Tags
                    <ul>
                        <li>
                            <a href="https://docs.casualos.com/tags/#color" target="_blank">#color</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/tags/#scale" target="_blank">#scale</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/tags/#form" target="_blank">#form</a>
                        </li>
                        <li>
                            <a href="https://docs.casualos.com/tags/#dimensionrotationx" target="_blank">#rotation</a>
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
                onClick={ () => handleChangeSequence("introDeep") }
            >
                Custom Shapes
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