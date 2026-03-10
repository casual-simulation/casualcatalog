// used to run the whole process of turning a pdf file into a knowledge inside of rb's brain
thisBot._console_postMessage({ "message": "Please submit the PDF.", "publicMessage": false });

await os.sleep(3000);

const files = await os.showUploadFiles();
console.log('files:', files);

let pdfFile = null;

for (let file of files) {
    if (file.mimeType === 'application/pdf') {
        pdfFile = file;
        break;
    }
}

if (!pdfFile) {
    thisBot._console_postMessage({ "message": "I'm sorry, that file wasn't a PDF.", "publicMessage": false });
    return;
}

console.log('pdfFile:', pdfFile);

let pdfString = await thisBot._ai_extractPDFText(pdfFile);
console.log("pdf string", pdfString);

thisBot._menu_rbThinking(true);

let pdfNeurons = await thisBot._ai_getPDFNeurons({ name: pdfFile.name, text: pdfString });

console.log("pdfNeurons", pdfNeurons);

thisBot._brain_createFGBNeurons({ neuronMods: pdfNeurons, neuronsColor: "white" });

thisBot._console_postMessage({ "message": "Memory updated with PDF information.", "publicMessage": true });

thisBot._menu_rbThinking(false);

if (humeSocket) {
    await os.sleep(10);

    let knowledgeBase = tags.knowledgeBase ?? [];

    const systemSettings = JSON.stringify(knowledgeBase);
    console.log("allowed_topics:", systemSettings)

    humeSocket.send(JSON.stringify({
        "type": "session_settings",
        "variables": {
            "allowed_topics": systemSettings,
        }
    }));
}