let artifactBot = getBot(byTag("artifactJournal", true));
let collectionAmount = artifactBot.tags.collectableAmounts[masks.openCollectionID];
if (collectionAmount == null || collectionAmount == undefined) collectionAmount = 0;

const {useState, useEffect} = os.appHooks;

function getItemGrid() {
    const elems = [];
    const numRows = Math.ceil(collectionAmount / 3);
    for (let i = 0; i < numRows; ++i) {
        elems.push(<tr>
                    {getItems(i * 3)}
                </tr>)
    }
    return elems;
}

function getItems(startingIndex: number) {
    const elems = [];
    for (let i = startingIndex; i < startingIndex + 3; ++i) {
        if (!artifactBot.tags.collectableIDs[masks.openCollectionID][i]) {
            continue;
        }

        elems.push(<td className="collection-cell" id={((masks.items[i] == 2) ? "fullUnlock" : "lock")}>
                        <div className="collection-cell-contents">
                            <img className="collection-img" src={artifactBot.tags.artifactData.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][i]).attributes.PhotoUrl} alt="Artifact 3" onClick={() => thisBot.getInfo(i)}/>
                        </div>
                    </td>)
    }
    return elems;
}

const App = () => {
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
            <span className="collection-numFound">{masks.openCollectionCompletion}/{collectionAmount} Artifacts Found</span>
            <table className="collection-table">
                {getItemGrid()}
            </table>
        </div>
    </>)
}

return App

// <button className="collection-launchInteractive" id={(collectionAmount < 1) ? "noInteract" : ((artifactBot.tags.artifactData.find(artifact => artifact.id === artifactBot.tags.collectableIDs[masks.openCollectionID][0]).attributes.Interactive) ? "interact" : "noInteract")}>
//     <span className="md-icon md-icon-font">extension</span>
// </button>
// <button className="collection-fullStar">
//     <span className="md-icon md-icon-font">stars</span>
// </button>