let artifactBot = getBot(byTag("name", "artifactData"));
let collectionAmount = artifactBot.tags.collectableAmounts[masks.openCollectionID];
if (collectionAmount == null || collectionAmount == undefined) collectionAmount = 0;

let saveLoad = getBot("name", "saveload");
let itemSaves = saveLoad.masks.itemSaves;

const {useState, useEffect} = os.appHooks;

const App = () => {
    const [items, setItems] = useState(masks.items);

    useEffect(() => {
        thisBot.vars.onItemsUpdate = (newItems) => {setItems(newItems)}
        return () => {thisBot.vars.onItemsUpdate = null}
    }, []);

    const [collectionsCompletion, setCompletion] = useState(masks.openCollectionCompletion);

    useEffect(() => {
        thisBot.vars.onCompletionUpdate = (newCompletion) => {setCompletion(newCompletion)}
        return () => {thisBot.vars.onCompletionUpdate = null}
    }, []);

    return (<>
        <style>{tags["App.css"]}</style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/neobrutalismcss@latest" />

        <div className="collection-container">
            <div className="collection-top-bar">
                <button className="collection-close-btn" onClick={() => thisBot.closeApp("x")}>
                    <span className="md-icon md-icon-font">close</span>
                </button>
            </div>
            <span className="collection-collectionName">{artifactBot.tags.collectionNames[masks.openCollectionID]}</span>
            <span className="collection-numFound">{collectionsCompletion}/{collectionAmount} Artifacts Found</span>
            <table className="collection-table">
                <tr>
                    <td className="collection-cell" id={(collectionAmount < 1) ? "nonexistent" : ((items[0] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 1) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][0]).attributes.PhotoUrl} alt="Artifact 1" onClick={() => thisBot.getInfo(0)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 1) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][0]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                    <td className="collection-cell" id={(collectionAmount < 2) ? "nonexistent" : ((items[1] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 2) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][1]).attributes.PhotoUrl} alt="Artifact 2" onClick={() => thisBot.getInfo(1)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 2) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][1]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                    <td className="collection-cell" id={(collectionAmount < 3) ? "nonexistent" : ((items[2] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 3) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][2]).attributes.PhotoUrl} alt="Artifact 3" onClick={() => thisBot.getInfo(2)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 3) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][2]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="collection-cell" id={(collectionAmount < 4) ? "nonexistent" : ((items[3] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 4) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][3]).attributes.PhotoUrl} alt="Artifact 4" onClick={() => thisBot.getInfo(3)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 4) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][3]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                    <td className="collection-cell" id={(collectionAmount < 5) ? "nonexistent" : ((items[4] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 5) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][4]).attributes.PhotoUrl} alt="Artifact 5" onClick={() => thisBot.getInfo(4)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 5) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][4]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                    <td className="collection-cell" id={(collectionAmount < 6) ? "nonexistent" : ((items[5] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 6) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][5]).attributes.PhotoUrl} alt="Artifact 6" onClick={() => thisBot.getInfo(5)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 6) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][5]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="collection-cell" id={(collectionAmount < 7) ? "nonexistent" : ((items[6] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 7) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][6]).attributes.PhotoUrl} alt="Artifact 7" onClick={() => thisBot.getInfo(6)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 7) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][6]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                    <td className="collection-cell" id={(collectionAmount < 8) ? "nonexistent" : ((items[7] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 8) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][7]).attributes.PhotoUrl} alt="Artifact 8" onClick={() => thisBot.getInfo(7)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 8) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][7]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                    <td className="collection-cell" id={(collectionAmount < 9) ? "nonexistent" : ((items[8] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={(collectionAmount < 9) ? null : artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][8]).attributes.PhotoUrl} alt="Artifact 9" onClick={() => thisBot.getInfo(8)}/>
                            <button className="collection-launchInteractive" id={(collectionAmount < 9) ? "noInteract" : ((artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][8]).attributes.Interactive) ? "interact" : "noInteract")}>
                                <span className="md-icon md-icon-font">extension</span>
                            </button>
                            <button className="collection-fullStar">
                                <span className="md-icon md-icon-font">stars</span>
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </>)
}

return App