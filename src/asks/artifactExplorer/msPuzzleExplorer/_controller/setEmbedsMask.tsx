let embededSites;

if (tags.embeds) {
// if (false) {
    embededSites = [...tags.embeds];
}
else if (configBot.tags.artifactNumbers && typeof configBot.tags.artifactNumbers == "string") {
    // else if (false) {
    let tempArray = configBot.tags.artifactNumbers;
    tempArray = tempArray
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(n => `https://grpmcollections.org/Detail/objects/${n}`);
    embededSites = tempArray;
}
else {
    embededSites = await importSheetLinks();
}

let shuffledLinks = shuffleArray(embededSites);
console.log("artifact links:", embededSites, shuffledLinks);
setTagMask(thisBot, "embeds", shuffledLinks, "shared");

function shuffleArray(array) {
    const result = [...array]; // make a copy so we don’t mutate the original
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // pick a random index
        [result[i], result[j]] = [result[j], result[i]]; // swap elements
    }
    return result;
}

async function importSheetLinks() {
    let sheetLink = "https://docs.google.com/spreadsheets/d/1wf8dHRBeaJEuGmq6rKZ5ftqOm3xnB2gkJNUPYZ9kYUg/edit?usp=sharing"

    let possibleGID = sheetLink.indexOf("#gid");

    if (possibleGID != -1) {
        possibleGID = sheetLink.substring(possibleGID);
    }

    sheetLink = sheetLink.replace("?usp=sharing" || possibleGID, "");

    sheetLink = sheetLink.replace("edit", "export?format=csv");

    let response = await web.hook({
        method: 'GET',
        url: sheetLink
    });

    const links = [...response.data.matchAll(/https:\/\/[^\s,]+/g)].map(match => match[0]);

    return links;
}